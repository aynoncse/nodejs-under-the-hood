const logger = require("./logger");
const setSecurityHeaders = require("./securityHeader");

const errorResponse = (req, res, error, startTime) => {
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

  const duration = Date.now() - startTime;
  logger(req, statusCode, duration);

  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'fail', message }));
};

module.exports = errorResponse;