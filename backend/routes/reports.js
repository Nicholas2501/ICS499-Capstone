const express = require("express");
const router = express.Router();
const { User } = require("../models");
const authenticateToken = require("../middleware/authenticateToken");

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "ptoBalance", "sickLeaveBalance"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;