const ApiResponse = require("@/@library/ApiResponse");
const AuthService = require("../services");
const asyncHandler = require("@/@library/asyncHandler");

class AuthController {
    static accessTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    static refreshTokenOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    static login = asyncHandler(async (req, res) => {
        const payload = await new AuthService(req).login(req.body);

        res.cookie("accessToken", payload.access_token, AuthController.accessTokenOptions);
        res.cookie("refreshToken", payload.refresh_token, AuthController.refreshTokenOptions);

        res.status(200).json(new ApiResponse(200, payload, "Logged in successfully"));
    });
    static whoAmI = asyncHandler(async (req, res) => {
        const accessToken =
            req.cookies?.accessToken ||  // Web: Secure HttpOnly Cookie
            req.headers["authorization"]?.split(" ")[1]; // Mobile: Bearer Token
        const payload = await new AuthService(req).whoAmI(accessToken);

        res.status(200).json(new ApiResponse(200, payload, "profile fetched successfully"));
    });

    static register = asyncHandler(async (req, res) => {
        const payload = await new AuthService(req).register(req.body);
        res.status(200).json(new ApiResponse(200, payload, "Registered successfully"));
    });

    static refreshToken = asyncHandler(async (req, res) => {
        const refreshToken =
            req.cookies?.refreshToken ||  // Web: Secure HttpOnly Cookie
            req.headers["authorization"]?.split(" ")[1]; // Mobile: Bearer Token

        if (!refreshToken) {
            throw new ApiError("Refresh token is required", 401);
        }

        const { accessToken, newRefreshToken } = await new AuthService(req).refreshToken(refreshToken);

        res.cookie("accessToken", accessToken, AuthController.accessTokenOptions);
        res.cookie("refreshToken", newRefreshToken, AuthController.refreshTokenOptions);

        res.status(200).json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"));
    });

    static logout = asyncHandler(async (req, res) => {
        if (!req.user || !req.user.id) {
            throw new ApiError("Unauthorized", 403);
        }

        await new AuthService(req).logout(req.user.id);

        res.clearCookie("accessToken", AuthController.accessTokenOptions);
        res.clearCookie("refreshToken", AuthController.refreshTokenOptions);

        res.status(200).json(new ApiResponse(200, {}, "Logout successful"));
    });
}

module.exports = AuthController;
