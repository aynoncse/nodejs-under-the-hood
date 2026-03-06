require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorResponse = require('./utils/errorResponse');
const setSecurityHeaders = require('./utils/securityHeader');
const urlModule = require('url');
const userRoutes = require('./routes/userRoutes');
const { getUploadPage, uploadFile } = require('./controllers/fileUploadController');

// Connect to Database
connectDB();

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    setSecurityHeaders(res);
    res.writeHead(204);
    return res.end();
  }

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

    if (pathname === '/signup' || pathname === '/login') {
      return await userRoutes(req, res, parsedUrl, sendResponse);
    }

    if (pathname.startsWith('/users')) {
      return await userRoutes(req, res, parsedUrl, sendResponse);
    }

    if (pathname.startsWith('/upload') && req.method === 'GET') {
      // render upload form via controller
      return getUploadPage(req, res);
    }

    if (pathname.startsWith('/upload') && req.method === 'POST') {
      // delegate file handling to controller
      return uploadFile(req, res, sendResponse);
    }

    // nothing matched; respond 404
    return sendResponse(404, { status: 'fail', error: 'Not Found' });
    
  } catch (error) {
    return errorResponse(req, res, error, startTime);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
