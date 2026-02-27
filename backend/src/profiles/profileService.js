import { db } from "../firebaseConfig.js";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp 
} from "firebase/firestore";


export async function createProfile(uid, profileData) {
  try {
    const userRef = doc(db, "users", uid);

    await setDoc(userRef, {
      ...profileData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Profile created successfully" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function getProfile(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      return { success: false, message: "User not found" };
    }

    return { success: true, data: snapshot.data() };

  } catch (error) {
    return { success: false, message: error.message };
  }
}


export async function updateProfile(uid, updatedData) {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });

    return { success: true, message: "Profile updated successfully" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}