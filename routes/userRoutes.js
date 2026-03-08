/**
 * routes/userRoutes.js
 *
 * Simple routing layer that inspects the request URL and method and delegates
 * to controller functions.  Authentication is enforced for protected
 * endpoints using a JWT verification utility.
 *
 * This file mimics express-style routing manually; in real-world projects you
 * would typically use a framework or dedicated router library.
 */
const { signup, login } = require('../controllers/authController');
const {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const authMiddleware = require('../utils/auth');
const mongoose = require('mongoose');
const { getUploadPage, uploadFile } = require('../controllers/fileUploadController');

const userRoutes = async (req, res, parsedUrl, sendResponse) => {
  const queryData = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  const { method, url } = req;

  // unauthenticated endpoints
  if (pathname.startsWith('/upload') && method === 'GET') {
    return getUploadPage(req, res);
  }

  if (pathname.startsWith('/upload') && method === 'POST') {
    return uploadFile(req, res, sendResponse);
  }

  if(pathname === '/signup' && method === 'POST') {
    return signup(req, res, sendResponse);
  }

  if(pathname === '/login' && method === 'POST') {
    return login(req, res, sendResponse);
  }

  const auth = authMiddleware(req);

  if (!auth.success) {
    return sendResponse(401, { status: 'fail', message: auth.message });
  }

  if (pathname === '/users' && method === 'GET') {
    return getAllUsers(req, res, queryData, sendResponse);
  }

  if (pathname === '/users' && method === 'POST') {
    return createUser(req, res, sendResponse);
  }

  if (pathname.startsWith('/users/')) {
    const id = url.split('/')[2];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendResponse(400, { status: 'fail', error: 'Invalid ID format' });
    }

    if (method === 'DELETE') {
      return deleteUser(id, sendResponse);
    }

    if (method === 'PUT') {
      return updateUser(req, id, sendResponse);
    }
  }
};


module.exports = userRoutes;
