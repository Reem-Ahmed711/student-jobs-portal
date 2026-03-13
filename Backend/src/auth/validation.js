function validateRegisterInput({ name, email, password }) {
  if (!name || !email || !password) throw new Error("All fields are required");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email))
     throw new Error("Invalid email format");

  if (password.length < 6)
     throw new Error("Password must be at least 6 characters");

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