/**
 * utils/validateSignupForm.js
 *
 * Validates signup payloads; checks name, email format, and password length.
 */
const validateSignupForm = (data) => {
  const errors = [];

  if (!data.name || data.name.trim().length < 3) {
    errors.push('Name must be at least 3 characters long.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!data.password) {
    errors.push('Password is required.');
  }else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    data: data,
  };
};

module.exports = validateSignupForm;
