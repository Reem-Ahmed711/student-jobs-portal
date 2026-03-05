const express = require("express");
const app = express();
const cors = require("cors");
require("./src/config/firebase");

// Middlewares
app.use(cors());
app.use(express.json());

// Test route
app.get("/test", (req, res) => {
    res.json({ message: "Server is working!" });
});

// Routes
app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api", require("./src/jobs/jobsRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));