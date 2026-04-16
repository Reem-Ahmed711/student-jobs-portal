// MOBILE-APP/app-backend/src/index.js
const express = require("express");
const cors = require("cors");

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

// ================= ROUTES =================
const authRoute = require("./Routes/authRoute");
const profileRoutes = require("./Routes/profile");
const jobRoutes = require("./Routes/jobRoute");
const applicationRoutes = require("./Routes/applicationRoute");
const adminRoutes = require("./Routes/adminRoute");
const employerRoutes = require("./Routes/employerRoute");
const ratingRoutes = require("./Routes/ratingRoute");

app.use("/api", authRoute);
app.use("/api", profileRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
