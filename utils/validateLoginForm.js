const validateLoginForm = (data) => {
  const errors = [];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!data.email) {
    errors.push('Email is required.');
  } else if (!emailRegex.test(data.email)) {
    errors.push('Please provide a valid email address.');
  }

  if (!data.password) {
    errors.push('Password is required.');
  } else if (data.password.length < 6) {
    errors.push('Password must be at least 6 characters long.');
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
    data: data,
  };
};

module.exports = validateLoginForm;
