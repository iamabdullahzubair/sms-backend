class ApiErrorResponse {
    constructor(statusCode, message, errors = null) {
        this.statusCode = statusCode;
        this.success = false;
        this.message = message;
        this.errors = errors;
    }
}

module.exports = ApiErrorResponse;
