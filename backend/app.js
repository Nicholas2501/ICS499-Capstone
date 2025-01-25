const express = require("express");
const cors = require("cors");
const sequelize = require("./config/db");
const ptoRoutes = require("./routes/ptoRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", ptoRoutes);
app.use("/api/auth", authRoutes);

// Sync database
sequelize.sync().then(() => {
  console.log("Database synced");
});

module.exports = app;