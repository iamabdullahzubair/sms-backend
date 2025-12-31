const UserRepo = require("../repositories/user.repo");

class UserService {
    constructor(req) {
        this.req = req;
        this.db = req.tenant;
        this.userRepo = new UserRepo(req.tenant);
    }

    _sanitizeUser(user) {
        if (!user) return null;

        const userData = user.get({ plain: true });
        delete userData.password;
        return userData;
    }


    async createUser(userData) {
        const transaction = await this.db.sequelize.transaction();
        try {
            const user = await this.userRepo.createUser(userData, transaction);
            await transaction.commit();
            return this._sanitizeUser(user);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getAllUsers(options) {
        const queryParams = {
            search: options?.search,
            page: parseInt(options?.page) || 1,
            limit: parseInt(options?.limit) || 10,
            sortBy: options?.sortBy || "created_at",
            sortOrder: options?.sortOrder || "DESC",
            isActive: options?.isActive ? this.req.query.isActive === "true" : undefined,
        };

        return this.userRepo.getAllUsers(queryParams);
    }

    async getUserById(id) {
        try {
            const user = await this.userRepo.getUserById(id);
            if (!user) {
                throw new Error("User not found");
            }
            return await this._sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }
    async getUserByEmail(email, transaction = null) {
        try {
            const user = await this.userRepo.getUserByEmail(email, transaction);
            if (!user) {
                throw new Error("User not found");
            }
            return await this._sanitizeUser(user);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = UserService;
