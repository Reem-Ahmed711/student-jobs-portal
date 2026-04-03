const { admin, db } = require("./firebase");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

//////////////////// REGISTER ////////////////////

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username) {
    return res
      .status(400)
      .json({ valid: false, message: "Name is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res
      .status(400)
      .json({ valid: false, message: "Invalid email format" });
  }

  if (!password || password.length < 6) {
    return res
      .status(400)
      .json({ valid: false, message: "Password must be at least 6 characters" });
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
    console.error("Firebase error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({
        valid: false,
        message: "Email already in use",
      });
    } else if (error.code === "auth/invalid-password") {
      return res.status(400).json({
        valid: false,
        message: "Password is invalid",
      });
    } else {
      return res.status(500).json({
        valid: false,
        message: "Server error, please try again",
        error: error.message,
      });
    }
  }
});

//////////////////// LOGIN ////////////////////

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log("Login request body:", req.body);

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

    console.log("Matching users count:", snapshot.size);

    if (snapshot.empty) {
      return res.status(404).json({
        valid: false,
        message: "User not found",
      });
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    console.log("User found:", userData);

    if (userData.password !== password) {
      return res.status(401).json({
        valid: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      valid: true,
      message: "Login successful",
      user: {
        uid: userData.uid,
        username: userData.username,
        email: userData.email,
      },
    });
  } catch (err) {
    console.error("FULL LOGIN ERROR:", err);
    return res.status(500).json({
      valid: false,
      message: "Server error",
      error: err.message,
    });
  }
});

//////////////////// SERVER ////////////////////

app.listen(3000, () => {
  console.log("Server runnnnning on port 3000");
});