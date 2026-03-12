const admin = require("firebase-admin");
require("../config/firebase");

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

  const userDocRef = admin.firestore().collection("users").doc(userRecord.uid);
  await userDocRef.set(userData);

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
      { email, password, returnSecureToken: true },
    );

    const { localId, idToken } = response.data;

    const userDoc = await admin
      .firestore()
      .collection("users")
      .doc(localId)
      .get();
    if (!userDoc.exists) throw new Error("User not found");

    const userData = userDoc.data();
    return { uid: localId, ...userData, token: idToken };
  } catch (err) {
    throw new Error(
      "Login failed: " + (err.response?.data?.error?.message || err.message),
    );
  }
}

async function googleLogin(idToken) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    const userDoc = await admin.firestore().collection("users").doc(uid).get();

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

      await admin.firestore().collection("users").doc(uid).set(userData);
      await assignRole(uid, "student");

      return { uid, ...userData, token: idToken };
    }

    const userData = userDoc.data();
    return { uid, ...userData, token: idToken };
  } catch (error) {
    throw new Error("Google login failed: " + error.message);
  }
}

async function linkedinLogin(accessToken, profileData) {
  try {
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
    const userDoc = await admin.firestore().collection("users").doc(uid).get();

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

      await admin.firestore().collection("users").doc(uid).set(userData);
      await assignRole(uid, "student");

      return { uid, ...userData };
    }

    const userData = userDoc.data();
    return { uid, ...userData };
  } catch (error) {
    throw new Error("LinkedIn login failed: " + error.message);
  }
}

async function forgotPassword(email) {
  try {
    const link = await admin.auth().generatePasswordResetLink(email);
    console.log(`Password reset link for ${email}:`, link);
    return {
      success: true,
      message: "Password reset link generated",
      link: link,
    };
  } catch (error) {
    throw new Error("Failed to generate reset link: " + error.message);
  }
}

async function resetPassword(oobCode, newPassword) {
  try {
    return { success: true, message: "Password reset successfully" };
  } catch (error) {
    throw new Error("Failed to reset password: " + error.message);
  }
}

async function verifyToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const uid = decodedToken.uid;

  const userDoc = await admin.firestore().collection("users").doc(uid).get();
  if (!userDoc.exists) throw new Error("User not found");

  const userData = userDoc.data();
  return { uid, ...userData };
}

async function updateUserProfile(uid, profileData) {
  try {
    const userRef = admin.firestore().collection("users").doc(uid);
    await userRef.update({
      ...profileData,
      updatedAt: new Date().toISOString(),
    });

    const updated = await userRef.get();
    return { success: true, data: updated.data() };
  } catch (error) {
    throw new Error("Failed to update profile: " + error.message);
  }
}
//updata
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
