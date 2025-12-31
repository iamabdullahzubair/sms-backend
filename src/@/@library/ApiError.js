// Custom error class for structured error handling
class ApiError extends Error {
    constructor(message, statusCode, data = null) {
        super(message);
        this.name = this.constructor.name;
        this.success = false;
        this.data = data;
        this.statusCode = statusCode || this.getDefaultStatusCode();
        Error.captureStackTrace(this, this.constructor);
    }

    getDefaultStatusCode() {
        switch (this.name) {
            case "ValidationError":
                return 400;
            case "SequelizeUniqueConstraintError":
            case "DuplicateKeyError":
                return 409;
            case "JsonWebTokenError":
                return 401;
            case "TokenExpiredError":
                return 401;
            case "NotFoundError":
                return 404;
            case "ForbiddenError":
                return 403;
            default:
                return 500; // Internal Server Error
        }
    }
}

module.exports = {ApiError};
