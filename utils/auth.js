const authMiddleware = (req) => {
  const token = req.headers['authorization'];
  const secretKey = 'my-secret-key';
  if (token && token == secretKey) {
    return { success: true };
  }
  return { success: false };
};

module.exports = authMiddleware;
