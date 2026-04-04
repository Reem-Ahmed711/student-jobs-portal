const { db } = require("../firebase");

// 🟢 GET ALL USERS
exports.getAllProfiles = async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🟢 GET ONE USER
exports.getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const doc = await db.collection("users").doc(userId).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🟡 CREATE USER
exports.createProfile = async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name & email required",
      });
    }

    const newUser = await db.collection("users").add({
      name,
      email,
      age: age || null,
      createdAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "User created",
      id: newUser.id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔵 UPDATE USER
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;

    const userRef = db.collection("users").doc(userId);

    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await userRef.update({
      ...data,
      updatedAt: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "User updated",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 🔴 DELETE USER
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    const userRef = db.collection("users").doc(userId);

    const doc = await userRef.get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await userRef.delete();

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
