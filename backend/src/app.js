// src/app.js
const express = require("express");
const app = express();

app.use(express.json());

// Routes
console.log("Loading Auth Routes:", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
// ✅ التعديل هنا: غيرنا المسار من routes لـ profiles
console.log("Loading Profile Routes:", require("./profiles/profileRoutes"));
app.use("/api/profile", require("./profiles/profileRoutes"));
console.log("Loading Dashboard Routes:", require("./routes/dashboardRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});