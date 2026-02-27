
const admin = require('../config/firebase');
const { validateRegisterInput, validateLoginInput } = require('./validation');
const { assignRole } = require('./roleService');
const axios = require('axios');


async function registerUser({ name, email, password, role = 'student' }) {
  validateRegisterInput({ name, email, password });

  const userRecord = await admin.auth().createUser({
    email,
    password,
    displayName: name,
  });

  const userDocRef = admin.firestore().collection('users').doc(userRecord.uid);
  await userDocRef.set({ name, email, role, createdAt: new Date().toISOString() });

  await assignRole(userRecord.uid, role);

  return { uid: userRecord.uid, name: userRecord.displayName, email: userRecord.email, role };
}


async function loginUser({ email, password }) {
  validateLoginInput({ email, password });

  const API_KEY = "AIzaSyDIarPCk6uaKVmi-4epeEHDgMLg67xdeFE"; 
  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
      { email, password, returnSecureToken: true }
    );

    const { localId, idToken } = response.data;

    const userDoc = await admin.firestore().collection('users').doc(localId).get();
    if (!userDoc.exists) throw new Error("User not found");

    const { name, role } = userDoc.data();
    return { uid: localId, name, email, role, token: idToken };
  } catch (err) {
    console.error("Firebase login error:", err.response?.data || err.message);
    throw new Error("Login failed: " + (err.response?.data?.error?.message || err.message));
  }
}


async function verifyToken(idToken) {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  const uid = decodedToken.uid;

  const userDoc = await admin.firestore().collection('users').doc(uid).get();
  if (!userDoc.exists) throw new Error("User not found");

  const { name, email, role } = userDoc.data();
  return { uid, name, email, role };
}

module.exports = { registerUser, loginUser, verifyToken };