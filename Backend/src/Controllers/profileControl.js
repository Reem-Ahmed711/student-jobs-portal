const { uploadProfileImage } = require("../services/storageService"); 
const { updateProfile } = require("../services/profileService"); 

const uploadAndSaveProfileImage = async (uid, file) => {
  try {
    const uploadResult = await uploadProfileImage(uid, file);
    if (!uploadResult.success) return uploadResult;

    await updateProfile(uid, { profileImage: uploadResult.url });
    return { success: true, url: uploadResult.url };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

module.exports = {
  uploadAndSaveProfileImage
};