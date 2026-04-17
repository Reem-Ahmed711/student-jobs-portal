const { admin, db } = require("../config/firebase");

const { validateRegisterInput, validateLoginInput } = require("./validation");
const { assignRole } = require("./roleService");
const axios = require("axios");

async function registerUser({
  name,
  email,
  password,
  role = "student",
  department,
  year,
  gpa,
  skills,
}) {
  validateRegisterInput({ name, email, password });

  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  const userData = {
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
    department: department || "",
    year: year || "",
    gpa: gpa || "",
    skills: skills || [],
    profileImage: "",
    phone: "",
    about: "",
    linkedin: "",
    github: "",
  };

  await db.collection("users").doc(userRecord.uid).set(userData);

  await assignRole(userRecord.uid, role);

  return {
    uid: userRecord.uid,
    name: userRecord.displayName,
    email: userRecord.email,
    role,
    ...userData,
  };
}

async function loginUser({ email, password }) {
  validateLoginInput({ email, password });

  const API_KEY = "AIzaSyDIarPCk6uaKVmi-4epeEHDgMLg67xdeFE";

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      {
        email,
        password,
        returnSecureToken: true,
      }
    );

    const { localId, idToken } = response.data;

    const userDoc = await db.collection("users").doc(localId).get();
    if (!userDoc.exists) throw new Error("User not found");

    return {
      uid: localId,
      ...userDoc.data(),
      token: idToken,
    };
  } catch (err) {
    throw new Error(
      "Login failed: " +
        (err.response?.data?.error?.message || err.message)
    );
  }
}

async function googleLogin(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const { uid, email, name, picture } = decodedToken;

  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const userData = {
      name: name || email.split("@")[0],
      email,
      role: "student",
      createdAt: new Date().toISOString(),
      department: "",
      year: "",
      gpa: "",
      skills: [],
      profileImage: picture || "",
      phone: "",
      about: "",
      linkedin: "",
      github: "",
    };

    await userRef.set(userData);
    await assignRole(uid, "student");

    return { uid, ...userData, token: idToken };
  }

  return { uid, ...userDoc.data(), token: idToken };
}

async function linkedinLogin(accessToken, profileData) {
  const { email, name, id } = profileData;

  let userRecord;

  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch {
    userRecord = await admin.auth().createUser({
      email,
      displayName: name,
      uid: id,
    });
  }

  const uid = userRecord.uid;
  const userRef = db.collection("users").doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const userData = {
      name: name || email.split("@")[0],
      email,
      role: "student",
      createdAt: new Date().toISOString(),
      department: "",
      year: "",
      gpa: "",
      skills: [],
      profileImage: "",
      phone: "",
      about: "",
      linkedin: "",
      github: "",
    };

    await userRef.set(userData);
    await assignRole(uid, "student");

    return { uid, ...userData };
  }

  return { uid, ...userDoc.data() };
}

async function forgotPassword(email) {
  const link = await admin.auth().generatePasswordResetLink(email);

  console.log(`Password reset link for ${email}:`, link);

  return {
    success: true,
    message: "Password reset link generated",
    link,
  };
}

async function resetPassword() {
  return {
    success: true,
    message: "Password reset handled by Firebase client SDK",
  };
}

async function verifyToken(idToken) {
  const decoded = await admin.auth().verifyIdToken(idToken);

  const userDoc = await db.collection("users").doc(decoded.uid).get();
  if (!userDoc.exists) throw new Error("User not found");

  return {
    uid: decoded.uid,
    ...userDoc.data(),
  };
}

async function updateUserProfile(uid, profileData) {
  const userRef = db.collection("users").doc(uid);

  await userRef.update({
    ...profileData,
    updatedAt: new Date().toISOString(),
  });

  const updated = await userRef.get();

  return {
    success: true,
    data: updated.data(),
  };
}

module.exports = {
  registerUser,
  loginUser,
  googleLogin,
  linkedinLogin,
  forgotPassword,
  resetPassword,
  verifyToken,
  updateUserProfile,
};