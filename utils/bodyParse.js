/**
 * utils/bodyParse.js
 *
 * Reads the raw request body and attempts to parse JSON.  This utility
 * returns a promise, enabling controllers to `await` parsed data.
 *
 * In production, a framework usually handles body parsing, including
 * validation of content-type and payload size limits.
 */
const getRequestBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => (body += chunk.toString()));
    req.on('end', () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(err);
      }
    });
  });
};

module.exports = getRequestBody;