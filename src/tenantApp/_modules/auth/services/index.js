const jwt = require("jsonwebtoken");
const { ApiError } = require("@/@library/ApiError");
const Bcrypt = require("@/@library/bcrypt");
const AuthRepo = require("database/repositories/tenant/auth.repo");
const { userSchema } = require("../validator");

class AuthService {
    constructor(req) {
        this.req = req;
        this.db = req.tenant;
        this.authRepo = new AuthRepo(req.tenant);
    }

    /**
     * Generates access and refresh tokens for a user.
     * @param {Object} user - User object.
     * @returns {{ accessToken: string, refreshToken: string }}
     */
    generateTokens(user) {
        const payload = { id: user.id, roleId: user.roleId };
        console.log("payload jwt", payload)
        return {
            accessToken: jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }),
            refreshToken: jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: "7d" })
        };
    }

    /**
     * Verifies access token.
     * @param {string} access_token - JWT access token.
     * @returns {Object} - Decoded token data.
     * @throws {ApiError} - If the token is invalid or expired.
     */
    verifyAccessToken(access_token) {
        try {
            return jwt.verify(access_token, process.env.JWT_SECRET);
        } catch (error) {
            throw new ApiError(error.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token", 401);
        }
    }

    /**
     * Verifies refresh token.
     * @param {string} refresh_token - JWT refresh token.
     * @returns {Object} - Decoded token data.
     * @throws {ApiError} - If the token is invalid or expired.
     */
    verifyRefreshToken(refresh_token) {
        try {
            return jwt.verify(refresh_token, process.env.REFRESH_SECRET);
        } catch (error) {
            throw new ApiError(error.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token", 401);
        }
    }

    /**
     * Handles user login.
     * @param {Object} data - Login credentials.
     * @returns {Promise<Object>} - Authenticated user with access token.
     * @throws {ApiError} - If credentials are invalid.
     */
    async login(data) {
        const { email, password } = data;
        if (!email || !password) throw new ApiError("Fields required", 400);

        const user = await this.authRepo.getUserByEmail(email);

        //  If user not found
        if (!user) throw new ApiError("Invalid credentials", 401);

        //  If account is locked due to too many failed attempts
        if (user.failed_login_attempts >= 5) {
            throw new ApiError("Account locked due to too many failed login attempts. Please contact admin.", 403);
        }

        //  If password is incorrect
        const isMatch = await Bcrypt.comparePassword(password, user.password);
        if (!isMatch) {
            await this.authRepo.incrementFailedLoginAttempts(user.id); // This is outside transaction
            throw new ApiError("Invalid credentials", 401);
        }

        const userId = user.id;

        // ✅ Valid credentials: Reset attempts & proceed with login
        return this.db.sequelize.transaction(async (transaction) => {
            const freshUser = await this.authRepo.getFullUserDetails(userId, transaction);
            const { accessToken, refreshToken } = this.generateTokens(freshUser);

            await Promise.all([
                this.authRepo.updateIsActive(userId, true, transaction),
                this.authRepo.updateLastLogin(userId, transaction),
                this.authRepo.updateRefreshToken(userId, refreshToken, transaction),
                this.authRepo.resetFailedLoginAttempts(userId, transaction),
            ]);

            const updatedUser = await this.authRepo.getFullUserDetails(userId, transaction);
            updatedUser.access_token = accessToken;
            updatedUser.refresh_token = refreshToken;
            return updatedUser;
        });
    }
    async whoAmI(accessToken) {
        if (!accessToken) {
            throw new ApiError("Access token not found", 403);
        }
        return this.db.sequelize.transaction(async (transaction) => {
            // 🔓 Decode and verify access token
            const decoded = this.verifyAccessToken(accessToken);
            // 🎯 Fetch user by ID (decoded from token)
            const user = await this.authRepo.getFullUserDetails(decoded.id, transaction);
            if (!user) {
                throw new ApiError("User not found", 404);
            }
            return user;
        });
    }

    /**
     * Handles user registration.
     * @param {Object} data - User registration data.
     * @returns {Promise<Object>} - Registered user.
     * @throws {ApiError} - If data is invalid or email already exists.
     */
    async register(data) {
        return this.db.sequelize.transaction(async (transaction) => {
            const parsedData = userSchema.safeParse(data);
            if (!parsedData.success) {
                throw new ApiError("Invalid data format", 400);
            }

            if (await this.authRepo.getUserByEmail(data.email)) {
                throw new ApiError("User with this email already exists", 409);
            }

            data.password = await Bcrypt.hashPassword(data.password);
            await this.authRepo.createUser(data, transaction);
            return await this.authRepo.getUserByEmail(data.email);
        });
    }

    /**
     * Handles refresh token process.
     * @param {string} refreshToken - Old refresh token.
     * @returns {Promise<{ accessToken: string, newRefreshToken: string }>} - New tokens.
     * @throws {ApiError} - If refresh token is invalid or expired.
     */
    async refreshToken(refreshToken) {
        if (!refreshToken) throw new ApiError("Refresh token not found", 403);

        return this.db.sequelize.transaction(async (transaction) => {
            const decoded = this.verifyRefreshToken(refreshToken);
            const user = await this.authRepo.getFullUserDetails(decoded.id, transaction);
            if (!user || user.refresh_token !== refreshToken) throw new ApiError("Invalid refresh token", 403);

            const { accessToken, refreshToken: newRefreshToken } = this.generateTokens(user);
            await this.authRepo.updateRefreshToken(user.id, newRefreshToken, transaction);
            return { accessToken, newRefreshToken };
        });
    }

    /**
     * Logs out a user by clearing their refresh token.
     * @param {number} userId - User ID.
     * @returns {Promise<void>}
     * @throws {ApiError} - If unauthorized.
     */
    async logout(userId) {
        if (!userId) throw new ApiError("Unauthorized", 401);
        return this.db.sequelize.transaction(async (transaction) => {
            await this.authRepo.updateRefreshToken(userId, null, transaction);
            await this.authRepo.updateIsActive(userId, false, transaction);
            await this.authRepo.updateLastLogin(userId, transaction);
        });
    }
}

module.exports = AuthService;
