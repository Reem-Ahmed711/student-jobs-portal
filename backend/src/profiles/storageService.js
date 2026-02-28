const admin = require("../config/firebase");

async function uploadProfileImage(uid, file) {
  try {
    const bucket = admin.storage().bucket();
    const blob = bucket.file(`profileImages/${uid}`);
    
    // حفظ الملف (بيفترض وجود multer في الـ route)
    await blob.save(file.buffer, { contentType: file.mimetype });
    await blob.makePublic();
    
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}`;
    return { success: true, url: publicUrl };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

async function deleteProfileImage(uid) {
  try {
    const bucket = admin.storage().bucket();
    await bucket.file(`profileImages/${uid}`).delete();
    return { success: true, message: "Profile image deleted successfully" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

module.exports = { uploadProfileImage, deleteProfileImage };