require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const getRequestBody = require('./utils/bodyParse');
const logger = require('./utils/logger');
const errorResponse = require('./utils/errorResponse');
const setSecurityHeaders = require('./utils/securityHeader');
const urlModule = require('url');

// Connect to Database
connectDB();

const server = http.createServer(async (req, res) => {
  const startTime = Date.now();
  const { method, url } = req;

  const sendResponse = (statusCode, data) => {
    setSecurityHeaders(res);
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));

    const duration = Date.now() - startTime;
    logger(req, statusCode, duration);
  };

  try {
    const parsedUrl = urlModule.parse(req.url, true);
    const queryData = parsedUrl.query;
    const pathname = parsedUrl.pathname;

    // Get all Users
    if (pathname === '/users' && method === 'GET') {
      let filter = {};
      if (queryData.name) {
        filter.name = { $regex: queryData.name, $options: 'i' };
      }
      if (queryData.email) {
        filter.email = queryData.email;
      }
      
      const users = await User.find(filter);
      return sendResponse(200, {
        status: 'success',
        results: users.length,
        users,
      });
    }

    // Create new user
    if (pathname === '/users' && method === 'POST') {
      const userData = await getRequestBody(req);
      const user = await User.create(userData);
      return sendResponse(201, {
        status: 'success',
        message: 'User created successfully',
        user: user,
      });
    }

    if (pathname.startsWith('/users/')) {
      const id = url.split('/')[2];

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(400, { error: 'Invalid ID format' });
      }

      // Delete user
      if (method === 'DELETE') {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted)
          return sendResponse(404, { status: 'fail', error: 'User not found' });
        return sendResponse(200, {
          status: 'success',
          message: 'User deleted successfully',
        });
      }

      // Update user
      if (method === 'PUT') {
        const userData = await getRequestBody(req);
        const updatedUser = await User.findByIdAndUpdate(id, userData, {
          returnDocument: 'after',
          runValidators: true, // Check schema validation before update
        });
        if (!updatedUser)
          return sendResponse(404, { status: 'fail', error: 'User not found' });
        return sendResponse(200, {
          status: 'success',
          message: 'User updated successfully',
          user: updatedUser,
        });
      }
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