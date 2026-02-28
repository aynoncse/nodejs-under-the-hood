require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const getRequestBody = require('./utils/bodyParse');
// Connect to Database
connectDB();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  const sendResponse = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };

  // Get all Users
  if (url === '/users' && method === 'GET') {
    const users = await User.find();
    return sendResponse(200, { users });
  }

  try {
    // Create new user
    if (url === '/users' && method === 'POST') {
      const userData = await getRequestBody(req);
      const user = await User.create(userData);
      return sendResponse(201, {
        message: 'User created successfully',
        user: user,
      });
    }

    if (url.startsWith('/users/')) {
      const id = url.split('/')[2];
      
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return sendResponse(400, { error: 'Invalid ID format' });
      }

      if (method === 'DELETE') {
        const deleted = await User.findByIdAndDelete(id);
        if (!deleted) return sendResponse(404, { error: 'Not found' });
        return sendResponse(200, { message: 'Deleted' });
      }

      if (method === 'PUT') {
        const userData = await getRequestBody(req);
        const updatedUser = await User.findByIdAndUpdate(id, userData, {
          returnDocument: 'after',
        });
        if (!updatedUser) return sendResponse(404, { error: 'Not found' });
        return sendResponse(200, {
          message: 'User updated successfully',
          user: updatedUser,
        });
      }
    }
    sendResponse(404, { error: 'Not Found' });
  } catch (error) {
    sendResponse(error.name === 'ValidationError' ? 400 : 500, {
      error: error.message,
    });
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
