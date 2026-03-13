const { auth, db } = require("../config/firebase");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = require("firebase/auth");
const { doc, setDoc, getDoc } = require("firebase/firestore");
// Register
async function registerUser({ name, email, password }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), { name, email });

    return { success: true, user: { id: user.uid, name, email } };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

// Login
async function loginUser({ email, password }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

  
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data();

    return { success: true, user: { id: user.uid, ...userData } };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { registerUser, loginUser };