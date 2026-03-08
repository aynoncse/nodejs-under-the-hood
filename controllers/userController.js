/**
 * controllers/userController.js
 *
 * CRUD operations for the User model.  Each exported function receives a
 * `sendResponse` helper to standardize JSON responses and a parsed body or
 * query data as needed.  Validation is performed earlier by validator
 * utilities.
 */

const User = require('../models/User');
const getRequestBody = require('../utils/bodyParse');

/**
 * Retrieve users matching optional query filters (name/email).
 *
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {Object} queryData - parsed URL query parameters
 * @param {Function} sendResponse - helper to write status/data JSON
 */
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

/**
 * Create a new user after validating request body.
 * Responds with 201 and the created document, or 400 on validation failure.
 */
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

/**
 * Delete a user by MongoDB ObjectId.
 * @param {string} id - user id to remove
 * @param {Function} sendResponse
 */
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

/**
 * Update a user's properties identified by id.
 * Accepts JSON body and runs schema validators on update.
 */
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
