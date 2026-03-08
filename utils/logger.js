/**
 * utils/logger.js
 *
 * Very simple request logger that prints to stdout.  Professional setups
 * should swap this out for a logging library that supports severity levels,
 * output to files or external services, and formats (JSON/CEF/etc).
 *
 * Logged data:
 *   - timestamp
 *   - HTTP method and URL
 *   - response status code
 *   - request duration in milliseconds
 */

const logger = (req, statusCode, duration) => {
  console.log(
    `[${new Date().toLocaleString()}] ${req.method} ${req.url} ${statusCode} - ${duration}ms`,
  );
};

module.exports = logger;