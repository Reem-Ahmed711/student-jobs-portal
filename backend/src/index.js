require("./config/firebase");
console.log("Server is running...");

const { registerUser, loginUser, verifyToken } = require('./auth/authService');
async function test() {
  try {
    const user = await registerUser({
      name: "Dina Ibrahim",
      email: "dinaaeebrahim@gmail.com",
      password: "Abc123@",
      role: "student"
    });
    console.log("User registered:", user);
  } catch (err) {
    console.log("Error:", err.message);
  }
}

test();