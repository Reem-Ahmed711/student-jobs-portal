// MOBILE-APP/app-backend/src/Controllers/imageController.js
const cloudinary = require("../cloudinary");
const { admin, db } = require("../firebase");

const uploadImage = async (req, res) => {
  try {
    console.log("🔵 Request received");
    const { imageBase64, folder } = req.body;
    const userId = req.user.uid;

    if (!imageBase64) {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    // 1. إزالة الـ data:image/jpeg;base64, لو موجودة
    let base64String = imageBase64;
    if (base64String.includes(",")) {
      base64String = base64String.split(",")[1];
    }

    // 2. تحويل base64 إلى Buffer
    const imageBuffer = Buffer.from(base64String, "base64");

    // 3. رفع الـ Buffer مباشرة إلى Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder || `users/${userId}`,
          transformation: [
            { width: 500, height: 500, crop: "limit" },
            { quality: "auto" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      uploadStream.end(imageBuffer);
    });

    const result = await uploadPromise;

    // 4. حفظ الرابط في Firestore
    await db.collection("users").doc(userId).update({
      profileImage: result.secure_url,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).json({
      success: true,
      data: { url: result.secure_url },
    });
  } catch (error) {
    console.error("❌ Upload error:", error.message);
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
