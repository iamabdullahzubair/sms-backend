const ApiErrorResponse = require('@/@library/ApiErrorResponse');
const Logging = require('../@library/logging');
const { ApiError } = require('@/@library/ApiError');

// Centralized error-handling middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

//   // Log errors
//   Logging.error(`[${err.name || 'SYSTEM ERROR'}] ${statusCode} - ${message}`);
//   Logging.error(`[Stack Trace] ${err.stack || 'No stack trace available'}`);
console.log("**********From Error Handler***********")
console.log(err.message);
console.log(err);
if (err.message.includes("CORS")) {
    Logging.warn(`Blocked CORS request from: ${req.header('Origin')}`);
  }


  // Send structured error response
  res.status(statusCode).json(
    new ApiErrorResponse(
      statusCode,
      message,
      process.env.NODE_ENV === 'development' ? err.stack : undefined
    )
  );
};

module.exports = {errorHandler} 