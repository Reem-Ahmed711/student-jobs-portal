import { db } from "../config/firebase.js";
import { 
  collection, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

export async function getAllUsers() {
  try {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return { success: true, data: users };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateUserByAdmin(uid, updatedData) {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      ...updatedData
    });

    return { success: true, message: "User updated successfully" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

/////(Firestore Only) 

export async function deleteUser(uid) {
  try {
    const userRef = doc(db, "users", uid);

    await deleteDoc(userRef);

    return { success: true, message: "User deleted successfully" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}