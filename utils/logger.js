const logger = (req, statusCode, duration) => {
  console.log(
    `[${new Date().toLocaleString()}] ${req.method} ${req.url} ${statusCode} - ${duration}ms`,
  );
};

module.exports = logger;