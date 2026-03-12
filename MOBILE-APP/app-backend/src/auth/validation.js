function validateRegister({ name, email, password }) {
  // Name validation
  if (!name || name.trim().length < 5) {
    return {
      valid: false,
      message: "Name is required and must be at least 5 characters"
    };
  }
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email format"
    };
  }
  // Password validation
  if (!password || password.length < 6) {
    return {
      valid: false,
      message: "Password must be at least 6 characters"
    };
  }

  return { valid: true };
}
// Login validation
function validateLogin({ email, password }) {

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return {
      valid: false,
      message: "Invalid email"
    };
  }
  if (!password) {
    return {
      valid: false,
      message: "Password is required"
    };
  }

  return { valid: true };
}

module.exports = {validateRegister,validateLogin};