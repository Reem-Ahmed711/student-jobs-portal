function validateRegisterInput({ name, email, password }) {
  if (!name || !email || !password) throw new Error("All fields are required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
     throw new Error("Invalid email format");

  if (password.length < 6)
     throw new Error("Password must be at least 6 characters");

  const strongPassword = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
  if (!strongPassword.test(password)) 
    throw new Error("Password must contain uppercase letter, number, and special character");

  return true;
}


function validateLoginInput({ email, password }) {
  if (!email || !password) throw new Error("Email and password are required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
     throw new Error("Invalid email format");

  return true;
}

module.exports = { validateRegisterInput, validateLoginInput };