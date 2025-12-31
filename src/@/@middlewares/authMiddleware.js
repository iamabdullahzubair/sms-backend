const jwt = require("jsonwebtoken");
const ApiError = require("../@library/ApiError");

const authMiddleware = async (req, res, next) => {
    try {
        // ✅ Extract token from cookie or authorization header
        const token = 
            req.cookies?.accessToken || 
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new ApiError("Unauthorized. Token missing.", 401);
        }

        // ✅ Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // ✅ Attach decoded user data to request object
        req.user = decoded;

        next(); // Continue to next middleware/controller
    } catch (error) {
        // ✅ Token Expired
        if (error.name === "TokenExpiredError") {
            return next(new ApiError("Session expired. Please log in again.", 401));
        }

        // ✅ Invalid Token
        return next(new ApiError("Invalid token. Please log in again.", 401));
    }
};

module.exports = authMiddleware;
