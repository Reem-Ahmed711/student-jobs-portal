function validateRegisterInput({
  name,
  email,
  password,
  role,
  year,
  gpa,
  skills,
}) {
  if (!name || name.trim().length < 3) {
    throw new Error("Name must be at least 3 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const roles = ["student", "employer", "admin"];
  if (role && !roles.includes(role)) {
    throw new Error("Invalid role");
  }

  if (year && isNaN(Number(year))) {
    throw new Error("Year must be a number");
  }

  
  if (gpa && (isNaN(Number(gpa)) || Number(gpa) < 0 || Number(gpa) > 5)) {
    throw new Error("GPA must be between 0 and 5");
  }

  if (skills && !Array.isArray(skills)) {
    throw new Error("Skills must be an array");
  }

  return true;
}

function validateLoginInput({ email, password }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    throw new Error("Invalid email");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  return true;
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};