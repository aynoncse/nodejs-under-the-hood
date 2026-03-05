require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorResponse = require('./utils/errorResponse');
const setSecurityHeaders = require('./utils/securityHeader');
const urlModule = require('url');
const userRoutes = require('./routes/userRoutes');

// Connect to Database
connectDB();

const server = http.createServer(async (req, res) => {
  const startTime = Date.now();

  const sendResponse = (statusCode, data) => {
    setSecurityHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

    const duration = Date.now() - startTime;
    logger(req, statusCode, duration);
  };

  try {
    const parsedUrl = urlModule.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    if(pathname.startsWith('/users')) {
      return await userRoutes(req, res, parsedUrl, sendResponse);
    }
   
    return sendResponse(404, { status: 'fail', error: 'Route Not Found' });
  } catch (error) {
    return errorResponse(req, res, error, startTime);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});