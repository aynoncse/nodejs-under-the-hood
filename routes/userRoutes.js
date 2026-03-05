const {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} = require('../controllers/userController');

const userRoutes = async (req, res, parsedUrl, sendResponse) => {
  const queryData = parsedUrl.query;
  const pathname = parsedUrl.pathname;

  const { method, url } = req;
  console.log('path er name', pathname);
  console.log('method', method);

  if (pathname === '/users' && method === 'GET') {
    return getAllUsers(req, res, queryData, sendResponse);
  }

  if (pathname === '/users' && method === 'POST') {
    return createUser(req, res, sendResponse);
  }

  if (pathname.startsWith('/users/')) {
    const id = url.split('/')[2];

    if (method === 'DELETE') {
      return deleteUser(id, sendResponse);
    }

    if (method === 'PUT') {
      return updateUser(req, id, sendResponse);
    }
  }
};

module.exports = userRoutes;
