const { PTORequest } = require("../models"); // Import from models/index.js

exports.submitPTORequest = async (req, res) => {
  const { startDate, endDate, leaveType, userId } = req.body;
  console.log("Received PTO request:", { startDate, endDate, leaveType, userId });

  try {
    const newRequest = await PTORequest.create({
      User_ID: userId,
      Start_Date: startDate,
      End_Date: endDate,
      Leave_Type: leaveType,
      Status: "Pending",
    });
    console.log("PTO request saved to database:", newRequest);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error("Error saving PTO request:", error);
    res.status(500).json({ error: "Failed to submit PTO request" });
  }
};