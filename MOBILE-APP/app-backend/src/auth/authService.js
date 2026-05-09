const { admin, db } = require("../firebase");
const axios = require("axios");
const { validateRegisterInput, validateLoginInput } = require("./validation");
const { assignRole } = require("./roleService");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@university.edu";

async function registerUser({
  name = "",
  email = "",
  password = "",
  role = "student",
  department = "",
  year = "",
  gpa = "",
  skills = [],
}) {
  try {
    // validation
    validateRegisterInput({ name, email, password, role, year, gpa, skills });

    // check existing user
    try {
      await admin.auth().getUserByEmail(email);
      throw new Error("Email already registered");
    } catch (err) {
      if (err.message === "Email already registered") throw err;
    }

    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    const finalRole = email === ADMIN_EMAIL ? "admin" : role;

    const userData = {
      uid: userRecord.uid,
      name,
      email,
      role: finalRole,
      department,
      year: Number(year) || "",
      gpa: Number(gpa) || "",
      skills,
      profileImage: "",
      phone: "",
      about: "",
      createdAt: new Date().toISOString(),
    };

    await admin
      .firestore()
      .collection("users")
      .doc(userRecord.uid)
      .set(userData);

    await assignRole(userRecord.uid, finalRole);

    return userData;
  } catch (err) {
    throw new Error(err.message);
  }
}

async function loginUser({ email, password }) {
  validateLoginInput({ email, password });

  const API_KEY = "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      },
    );

    const { localId, idToken } = response.data;

    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(localId)
      .get();

    if (!userDoc.exists) throw new Error("User not found");

    const userData = userDoc.data();

    return {
      uid: localId,
      token: idToken,
      ...userData,
      isAdmin: userData.email === ADMIN_EMAIL || userData.role === "admin",
    };
  } catch (err) {
    throw new Error(
      "Login failed: " + (err.response?.data?.error?.message || err.message),
    );
  }
}
// أضيفي هذا الكود في آخر ملف authService.js قبل module.exports

// ================= Forgot Password =================
async function forgotPassword({ email }) {
  try {
    const API_KEY = "AIzaSyDIarPCk6uaKVmi-4epeEHDgMLg67xdeFE";

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${API_KEY}`,
      {
        email: email,
        requestType: "PASSWORD_RESET",
      },
    );

    return {
      success: true,
      message: "Password reset email sent successfully",
    };
  } catch (err) {
    const errorMessage = err.response?.data?.error?.message || err.message;
    throw new Error(errorMessage);
  }
}

async function resetPassword({ oobCode, newPassword }) {
  try {
    const API_KEY = "AIzaSyDIarPCk6uaKVmi-4epeEHDgMLg67xdeFE";

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${API_KEY}`,
      {
        oobCode: oobCode,
        newPassword: newPassword,
      },
    );

    return {
      success: true,
      message: "Password reset successfully",
    };
  } catch (err) {
    const errorMessage = err.response?.data?.error?.message || err.message;
    throw new Error(errorMessage);
  }
}

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
