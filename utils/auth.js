/**
 * utils/auth.js
 *
 * Simple JWT authentication middleware. Parses the Authorization header and
 * verifies the token using JWT_SECRET.  In production, consider token
 * revocation, refresh tokens, and stronger validation.
 */
const jwt = require('jsonwebtoken');

const authMiddleware = (req) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { success: false, message: 'Please login first' };
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, userId: decoded.id };
  } catch (err) {
    return { success: false, message: 'Token is invalid or expired' };
  }
};

module.exports = authMiddleware;
