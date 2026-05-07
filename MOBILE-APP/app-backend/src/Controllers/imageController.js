// MOBILE-APP/app-backend/src/Controllers/imageController.js
const cloudinary = require("../cloudinary");
const { admin, db } = require("../firebase");

const uploadImage = async (req, res) => {
  try {
    const { imageBase64, folder } = req.body;
    const userId = req.user.uid;

    if (!imageBase64) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    //
    const result = await cloudinary.uploader.upload(imageBase64, {
      folder: folder || `users/${userId}`,
      transformation: [
        { width: 500, height: 500, crop: "limit" },
        { quality: "auto" },
        { fetch_format: "auto" },
      ],
    });

    const imageDoc = await db.collection("images").add({
      url: result.secure_url,
      publicId: result.public_id,
      uploadedBy: userId,
      folder: folder || "profile",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      size: result.bytes,
    });

    await db.collection("users").doc(userId).update({
      profileImage: result.secure_url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      data: {
        id: imageDoc.id,
        url: result.secure_url,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUserImages = async (req, res) => {
  try {
    const { userId } = req.params;

    const imagesSnapshot = await db
      .collection("images")
      .where("uploadedBy", "==", userId)
      .orderBy("createdAt", "desc")
      .get();

    const images = imagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({ success: true, data: images });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { imageId } = req.params;
    const userId = req.user.uid;

    const imageDoc = await db.collection("images").doc(imageId).get();
    if (!imageDoc.exists) {
      return res
        .status(404)
        .json({ success: false, message: "Image not found" });
    }

    const imageData = imageDoc.data();

    if (imageData.uploadedBy !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own images",
      });
    }

    await cloudinary.uploader.destroy(imageData.publicId);

    // حذف من Firestore
    await db.collection("images").doc(imageId).delete();

    res.status(200).json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadImage,
  getUserImages,
  deleteImage,
};
