import { storage } from "../firebaseConfig.js";
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from "firebase/storage";


export async function uploadProfileImage(uid, file) {
  try {
       const imageRef = ref(storage, `profileImages/${uid}`);

        await uploadBytes(imageRef, file);

        const downloadURL = await getDownloadURL(imageRef);

    return { success: true, url: downloadURL };

  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function deleteProfileImage(uid) {
  try {
    const imageRef = ref(storage, `profileImages/${uid}`);

    await deleteObject(imageRef);

    return { success: true, message: "Profile image deleted successfully" };

  } catch (error) {
    return { success: false, message: error.message };
  }
}