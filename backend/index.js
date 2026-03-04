const express = require("express");
const app = express();
const cors = require("cors");
require("./src/config/firebase");

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./src/routes/authRoutes"));

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));