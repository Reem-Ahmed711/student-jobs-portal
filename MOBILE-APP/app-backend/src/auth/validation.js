
function validateRegisterInput({ name, email, password, role, year, gpa, skills }) {
 
  if (!name || name.trim().length < 5) {
    return { valid: false, message: "Name is required and must be at least 5 characters" };
  }

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format" };
  }


  if (!password || password.length < 6) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }


  const roles = ["student", "employer", "admin"];
  if (role && !roles.includes(role)) {
    return { valid: false, message: "Invalid role" };
  }


  if (year && (!Number.isInteger(year) || year < 1)) {
    return { valid: false, message: "Year must be a positive integer" };
  }


  if (gpa && (typeof gpa !== "number" || gpa < 0 || gpa > 4)) {
    return { valid: false, message: "GPA must be a number between 0 and 4" };
  }


  if (skills && !Array.isArray(skills)) {
    return { valid: false, message: "Skills must be an array" };
  }

  return { valid: true };
}

function validateLoginInput({ email, password }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return { valid: false, message: "Invalid email" };
  }
  if (!password) {
    return { valid: false, message: "Password is required" };
  }
  return { valid: true };
}

module.exports = { validateRegisterInput, validateLoginInput };