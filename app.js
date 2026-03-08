/**
 * Title: Core Node.js REST API
 * Description: A battle-tested, RESTful backend API implemented solely with Node.js core modules
 * Author: Sador Uddin Bhuiyan Aynon
 * Date: 2026-03-01
 */

/**
 * app.js - Main HTTP server for the application
 *
 * A compact framework‑free HTTP server built on Node.js core modules.
 *
 * Contains routing logic for authentication, user management, and file
 * uploads.  Helpers are defined below to centralize response formatting
 * (`createSendResponse`) and static file delivery (`serveUploadAsset`).
 *
 * Although intended for educational purposes, the code is structured to
 * resemble a minimal MVC pattern.  Production systems should migrate to a
 * mature framework such as Express or Fastify for enhanced middleware
 * support and maintainability.
 */

require('dotenv').config();
const http = require('http');
const connectDB = require('./config/db');
const logger = require('./utils/logger');
const errorResponse = require('./utils/errorResponse');
const setSecurityHeaders = require('./utils/securityHeader');
const urlModule = require('url');
const userRoutes = require('./routes/userRoutes');

const path = require('path');
const fs = require('fs');

// Connect to Database
connectDB();


// helper utilities --------------------------------------------------
// - `createSendResponse` returns a closure bound to the request/response
//   pair and start time.  It applies security headers, logs timing, and
//   centralizes JSON formatting.
// - `serveUploadAsset` and `isStaticUpload` handle readonly file serving
//   from the `/uploads` directory.  This keeps file-streaming out of the
//   main request branch.

function createSendResponse(res, req, startTime) {
  return (statusCode, data) => {
    setSecurityHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

    const duration = Date.now() - startTime;
    logger(req, statusCode, duration);
  };
}

function serveUploadAsset(pathname, res) {
  const filePath = path.join(__dirname, pathname);
  if (!fs.existsSync(filePath)) return false;

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
  };

  res.writeHead(200, {
    'Content-Type': mimeTypes[ext] || 'application/octet-stream',
  });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function isStaticUpload(pathname, method) {
  return method === 'GET' && pathname.startsWith('/uploads/');
}

// server --------------------------------------------------
const server = http.createServer(async (req, res) => {
  const startTime = Date.now();

    // CORS preflight requests are short‑circuited here
  if (req.method === 'OPTIONS') {
    setSecurityHeaders(res);
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = urlModule.parse(req.url || '', true);
  const { pathname } = parsedUrl;
  const sendResponse = createSendResponse(res, req, startTime);

  try {
    // static files under /uploads
    if (isStaticUpload(pathname, req.method)) {
      if (serveUploadAsset(pathname, res)) return;
    }

    // delegate all route logic to central router
    if (
      pathname === '/signup' ||
      pathname === '/login' ||
      pathname.startsWith('/users') ||
      pathname.startsWith('/upload')
    ) {
      return await userRoutes(req, res, parsedUrl, sendResponse);
    }

    // catch-all
    return sendResponse(404, { status: 'fail', error: 'Not Found' });
  } catch (error) {
    return errorResponse(req, res, error, startTime);
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
