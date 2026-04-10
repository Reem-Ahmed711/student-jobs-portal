const express = require("express");
const app = express();

app.use(express.json());

// ================= Routes =================
const authRoute = require("./Routes/authRoute");
const profileRoutes = require("./Routes/profile");
const dashboardRoutes = require("./Routes/dashboard");
const jobRoutes = require("./Routes/jobRoute");
const applicationRoutes = require("./Routes/applicationRoute");

// ================= Use Routes =================
app.use("/api", authRoute);
app.use("/api", profileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);

// ================= Home Route =================
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// ================= 404 Handler =================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ================= Error Handler =================
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

// ================= Start Server =================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});