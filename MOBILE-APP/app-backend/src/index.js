// MOBILE-APP/app-backend/src/index.js
const express = require("express");
const cors = require("cors");
const { registerUser, loginUser } = require("./auth/authService");

const app = express();

// ================= CORS FIX =================
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./firebase");

// ================= AUTH ROUTES (مباشرة من غير ملف منفصل) =================
app.post("/api/register", async (req, res) => {
  try {
    let userData = req.body;
    if (userData.username && !userData.name) {
      userData.name = userData.username;
      delete userData.username;
    }
    const result = await registerUser(userData);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ success: true, data: result });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
});

// ================= ROUTES =================
const profileRoutes = require("./Routes/profile");
const jobRoutes = require("./Routes/jobRoute");
const applicationRoutes = require("./Routes/applicationRoute");
const adminRoutes = require("./Routes/adminRoute");
const employerRoutes = require("./Routes/employerRoute");
const ratingRoutes = require("./Routes/ratingRoute");

app.use("/api", profileRoutes);
app.use("/api/jobs", jobRoutes);
// ✅ التعديل هنا: /api/applications بدل /api
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", employerRoutes);
app.use("/api", ratingRoutes);

// ================= HEALTH =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= 404 FIX =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});