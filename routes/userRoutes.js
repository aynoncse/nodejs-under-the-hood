const {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');
const authMiddleware = require('../utils/auth');


const userRoutes = async (req, res, parsedUrl, sendResponse) => {
  const queryData = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  const { method, url } = req;

  if (pathname === '/users' && method === 'GET') {
    return getAllUsers(req, res, queryData, sendResponse);
  }

  if (pathname === '/users' && method === 'POST') {
    return createUser(req, res, sendResponse);
  }

  if (pathname.startsWith('/users/')) {
    const auth = authMiddleware(req);

    if (!auth.success) {
      return sendResponse(401, { status: 'fail', message: auth.message });
    }

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
