const { admin, db } = require("./../firebase");

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res.status(400).json({ valid: false, message: "Name is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ valid: false, message: "Invalid email" });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      valid: false,
      message: "Password must be at least 6 characters",
    });
  }

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    await db.collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      username,
      email,
      password,
      createdAt: new Date(),
    });

    res.status(201).json({
      valid: true,
      message: "User registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      message: error.message,
    });
  }
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      valid: false,
      message: "Email and password are required",
    });
  }

  try {
    const snapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({
        valid: false,
        message: "User not found",
      });
    }

    const userData = snapshot.docs[0].data();

    if (userData.password !== password) {
      return res.status(401).json({
        valid: false,
        message: "Invalid password",
      });
    }

    res.status(200).json({
      valid: true,
      message: "Login successful",
      user: {
        uid: userData.uid,
        username: userData.username,
        email: userData.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      valid: false,
      message: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
};