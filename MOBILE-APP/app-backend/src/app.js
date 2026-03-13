const admin = require("firebase-admin");
const serviceAccount = require("../../../Backend/src/config/service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

///////////////
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;


  if (!username ) {
    return res
      .status(400)
      .json({ valid: false, message: "Name is required " });
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
      displayName: username
    });

await db.collection("users").doc(userRecord.uid).set({
  username,
  email,
  password,  
  createdAt: new Date()
});

    res.status(201).json({ valid: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Firebase error:", error);

    if (error.code === "auth/email-already-exists") {
      return res.status(400).json({ valid: false, message: "Email already in use" });
    } else if (error.code === "auth/invalid-password") {
      return res.status(400).json({ valid: false, message: "Password is invalid" });
    } else {
      return res.status(500).json({ valid: false, message: "Server error, please try again" });
    }
  }
});
////////////////////////

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ valid: false, message: "Email and password are required" });
  }

  try {
  
    const userRecord = await admin.auth().getUserByEmail(email);

    const userDoc = await db.collection("users").doc(userRecord.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ valid: false, message: "User not found" });
    }

    const userData = userDoc.data();

    
    if (userData.password && userData.password === password) {
      return res.status(200).json({ valid: true, message: "Login successful", user: userData });
    } else {
      return res.status(401).json({ valid: false, message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ valid: false, message: "Server error" });
  }
});
app.listen(3000, () => {
  console.log("Server runnnnning on port 3000");
});
