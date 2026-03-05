const validateUser = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length < 3) {
      errors.push('Name must be at least 3 characters long.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push('Please provide a valid email address.');
    }

    return {
      isValid: errors.length === 0,
      errors: errors,
    };
};
