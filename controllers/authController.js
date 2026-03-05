const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getRequestBody = require('../utils/bodyParse');
const validateSignupForm = require('../utils/validateSignupForm');
const validateLoginForm = require('../utils/validateLoginForm');

const signup = async (req, res, sendResponse) => {
  const { name, email, password } = await getRequestBody(req);

  const validate = validateSignupForm({ name, email, password });

  console.log('validate', validate);
  

  if (!validate.isValid) {
    return sendResponse(400, { status: 'Validation failed', errors: validate.errors });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return sendResponse(201, {
    status: 'success',
    message: 'User created successfully',
    user,
  });
};


const login = async (req, res, sendResponse) => {
  const { email, password } = await getRequestBody(req);

  const validate = validateLoginForm({ email, password });

  if (!validate.isValid) {
    return sendResponse(400, { status: 'Validation failed', errors: validate.errors });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return sendResponse(401, { status: 'fail', message: 'User not found with this email' });
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return sendResponse(401, { status: 'fail', message: 'Incorrect password' });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  return sendResponse(200, {
    status: 'success',
    message: 'User logged in successfully',
    token,
  });
};


module.exports = { signup, login };