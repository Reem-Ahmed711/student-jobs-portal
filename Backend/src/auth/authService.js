// C:\Student-job-portal\Backend\src\auth\authService.js
const { admin, db } = require("../config/firebase");
const axios = require("axios");
const { validateRegisterInput, validateLoginInput } = require("./validation");
const { assignRole } = require("./roleService");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@university.edu";
const API_KEY = process.env.FIREBASE_API_KEY || "AIzaSyCD3-s0qrIQ4oIgI8T3r7_HnbMSO1Z6K1s";

async function registerUser({
  name = "",
  email = "",
  password = "",
  role = "student",
  department = "",
  year = "",
  gpa = "",
  skills = [],
  phone = "",
}) {
  try {
    console.log("📝 Register attempt:", { name, email, role });

    validateRegisterInput({ name, email, password, role, year, gpa, skills });

    // Check if user exists
    try {
      await admin.auth().getUserByEmail(email);
      throw new Error("Email already registered");
    } catch (err) {
      if (err.message === "Email already registered") throw err;
    }

    // Create user in Firebase Auth
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: name,
    });
    console.log("✅ User created in Auth:", userRecord.uid);

    const finalRole = email === ADMIN_EMAIL ? "admin" : role;

    // Save to Firestore
    const userData = {
      uid: userRecord.uid,
      name,
      email,
      role: finalRole,
      department: department || "",
      year: year ? Number(year) : "",
      gpa: gpa ? Number(gpa) : "",
      skills: skills || [],
      profileImage: "",
      phone: phone || "",
      about: "",
      createdAt: new Date().toISOString(),
    };

    await db.collection("users").doc(userRecord.uid).set(userData);
    console.log("✅ User saved to Firestore");

    await assignRole(userRecord.uid, finalRole);
    console.log("✅ Role assigned");

    // 🔥 IMPORTANT: Login automatically to get ID Token (NOT custom token)
    const loginResponse = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const { idToken, localId } = loginResponse.data;

    console.log("✅ Got ID Token from Firebase");

    return {
      success: true,
      token: idToken,
      uid: userRecord.uid,
      name,
      email,
      role: finalRole,
      department: department || "",
      year: year ? Number(year) : "",
      gpa: gpa ? Number(gpa) : "",
      skills: skills || [],
      phone: phone || "",
    };
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    throw new Error(err.message);
  }
}

async function loginUser({ email, password }) {
  validateLoginInput({ email, password });

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const { localId, idToken } = response.data;

    const userDoc = await db.collection("users").doc(localId).get();
    if (!userDoc.exists) throw new Error("User not found");

    const userData = userDoc.data();

    return {
      success: true,
      token: idToken,
      uid: localId,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department || "",
      year: userData.year || "",
      gpa: userData.gpa || "",
      skills: userData.skills || [],
      phone: userData.phone || "",
      profileImage: userData.profileImage || null,
    };
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw new Error("Login failed: " + (err.response?.data?.error?.message || err.message));
  }
}

module.exports = {
  registerUser,
  loginUser,
};
