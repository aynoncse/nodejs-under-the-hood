/**
 * utils/errorResponse.js
 *
 * Centralized error handler used by the main server.  It logs the error,
 * adds security headers, and sends a JSON response.  The stack trace is
 * omitted in production (NODE_ENV === 'production').
 */

const logger = require("./logger");
const setSecurityHeaders = require("./securityHeader");

const errorResponse = (req, res, error, startTime) => {
  const duration = Date.now() - startTime;
  logger(req, error.statusCode || 500, duration, error);

  setSecurityHeaders(res);
  let statusCode = 500;
  let message = 'Internal Server Error';

  // ১. Mongoose Validation Error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors)
      .map((el) => el.message)
      .join(', ');
  }

  // ২. Duplicate Key Error
  if (error.code === 11000) {
    statusCode = 400;
    message = 'Email already exists. Please use a different one.';
  }

  // ৩. Invalid ObjectId format Error
  if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${error.path}: ${error.value}`;
  }

  // already logged above before header sent, but recalc for completeness
  // include stack/message in development to ease debugging
  const responseBody = { status: 'fail', message };
  
  if (process.env.NODE_ENV !== 'production') {
    responseBody.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(responseBody));
};

module.exports = errorResponse;