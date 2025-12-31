const Logging = require("../@library/logging");

const requestLogger = (req, res, next) => {
    Logging.apiLog(`[${req.method}] ${req.originalUrl}`);
    next(); // Pass control to the next middleware
};

module.exports = {requestLogger}