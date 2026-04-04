const express = require("express");
const app = express();

app.use(express.json());

const profileRoutes = require("./Routes/profile");
const dashboardRoutes = require("./Routes/dashboard");

app.use("/api", profileRoutes);
app.use("/api", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
