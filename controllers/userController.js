const User = require('../models/User');
const getRequestBody = require('../utils/bodyParse');

const getAllUsers = async (req, res, queryData, sendResponse) => {
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
};

const createUser = async (req, res, sendResponse) => {
  const userData = await getRequestBody(req);
  const validation = validateUser(userData);
  if (!validation.isValid) {
    return sendResponse(400, { status: 'Validation failed', errors: validation.errors });
  }

  const user = await User.create(userData);
  return sendResponse(201, {
    status: 'success',
    message: 'User created successfully',
    user: user,
  });
};

const deleteUser = async (id, sendResponse) => {
  const deleted = await User.findByIdAndDelete(id);
  
  if (!deleted) {
    return sendResponse(404, { status: 'fail', error: 'User not found' });
  }

  return sendResponse(200, {
    status: 'success',
    message: 'User deleted successfully',
  });
};

const updateUser = async (req, id, sendResponse) => {
    const userData = await getRequestBody(req);
    const updatedUser = await User.findByIdAndUpdate(id, userData, {
      returnDocument: 'after',
      runValidators: true, // Check schema validation before update
    });

    if (!updatedUser){
        return sendResponse(404, { status: 'fail', error: 'User not found' });
    }

    return sendResponse(200, {
      status: 'success',
      message: 'User updated successfully',
      user: updatedUser,
    });
};

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser
};
