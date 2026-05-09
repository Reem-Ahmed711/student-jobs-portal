const { admin } = require("../config/firebase"); // تأكد من الـ import الصحيح

async function uploadProfileImage(uid, file) {
  try {
    const bucket = admin.storage().bucket();
    // 🔥 إضافة timestamp لتجنب caching ومشاكل الأسماء المكررة
    const timestamp = Date.now();
    const blob = bucket.file(`profileImages/${uid}/${timestamp}_${file.originalname}`);

    await blob.save(file.buffer, { 
      contentType: file.mimetype,
      metadata: {
        firebaseStorageDownloadTokens: uid
      }
    });
    await blob.makePublic();
    
    // 🔥 طريقة أفضل للحصول على URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/profileImages/${uid}/${timestamp}_${file.originalname}`;
    
    return { success: true, url: publicUrl };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, message: error.message };
  }
}

async function deleteProfileImage(uid) {
  try {
    const bucket = admin.storage().bucket();
    
    // 🔥 حذف كل الصور الخاصة بالمستخدم (ليس فقط صورة واحدة)
    const [files] = await bucket.getFiles({ prefix: `profileImages/${uid}/` });
    
    for (const file of files) {
      await file.delete();
    }
    
    return { success: true, message: "Profile image deleted successfully" };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, message: error.message };
  }
}

module.exports = { uploadProfileImage, deleteProfileImage };
