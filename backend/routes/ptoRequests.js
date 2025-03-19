const express = require("express");
const router = express.Router();
const { PTORequest, User, LeavePolicy } = require("../models");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { startOfDay, endOfDay, differenceInCalendarDays } = require("date-fns"); // For date calculations
const Op = require("sequelize").Op; // Sequelize operators

dotenv.config();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied" });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });
    req.user = user;
    next();
  });
};

// Create a new PTO request
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { userId, startDate, endDate, leaveType } = req.body;

    // Validate input
    if (!startDate || !endDate || !leaveType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure the dates are valid
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({ message: "Invalid date format" });
    }
    if (parsedStartDate > parsedEndDate) {
      return res.status(400).json({ message: "Start date cannot be after end date" });
    }

    // Calculate days requested (inclusive of both start and end dates)
    const daysRequested = differenceInCalendarDays(parsedEndDate, parsedStartDate) + 1;

    // Fetch the user's role
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch the leave policy for the user's role and leave type
    const policy = await LeavePolicy.findOne({
      where: { leaveType, role: user.role }, // Ensure policy is role-specific
    });
    if (!policy) {
      return res.status(404).json({ message: "Leave policy not found" });
    }

    // Calculate total days used this year
    const yearStart = startOfDay(new Date(new Date().getFullYear(), 0, 1));
    const yearEnd = endOfDay(new Date(new Date().getFullYear(), 11, 31));

    const requestsThisYear = await PTORequest.findAll({
      where: {
        userId,
        leaveType,
        status: "Approved",
        startDate: { [Op.between]: [yearStart, yearEnd] },
      },
    });

    const totalDaysUsed = requestsThisYear.reduce(
      (total, request) => total + request.daysRequested,
      0
    );

    // Check if the request exceeds the policy limit
    if (totalDaysUsed + daysRequested > policy.maxDaysPerYear) {
      return res.status(400).json({
        message: `Exceeds maximum allowed days for ${leaveType}. You have ${
          policy.maxDaysPerYear - totalDaysUsed
        } days remaining.`,
      });
    }

    // Create the PTO request
    const ptoRequest = await PTORequest.create({
      userId,
      startDate: parsedStartDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      endDate: parsedEndDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      leaveType,
      daysRequested, // Include daysRequested in the database
      status: "Pending", // Default status is "Pending"
    });

    res.status(201).json({ message: "PTO request submitted successfully", ptoRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all PTO requests for the logged-in employee
router.get("/my-requests", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from the decoded JWT token

    // Fetch all PTO requests for the user
    const requests = await PTORequest.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]], // Order by most recent requests
    });

    // Log the raw data for debugging
    console.log("Raw PTO Requests:", JSON.stringify(requests, null, 2));

    // Format dates as YYYY-MM-DD, handling null or invalid values
    const formattedRequests = requests.map((request) => {
      const startDate = isValidDate(request.startDate)
        ? new Date(request.startDate).toISOString().split("T")[0] // Extract YYYY-MM-DD
        : "Invalid Date";
      const endDate = isValidDate(request.endDate)
        ? new Date(request.endDate).toISOString().split("T")[0] // Extract YYYY-MM-DD
        : "Invalid Date";

      return {
        ...request.toJSON(),
        startDate,
        endDate,
      };
    });

    res.json(formattedRequests);
  } catch (err) {
    console.error("Error in /my-requests route:", err.message); // Log the specific error message
    console.error(err.stack); // Log the full stack trace for debugging
    res.status(500).json({ message: "Server error" });
  }
});

// Helper function to validate dates
function isValidDate(date) {
  return date && !isNaN(new Date(date).getTime());
}

// Get all pending PTO requests (for managers)
router.get("/pending", authenticateToken, async (req, res) => {
  try {
    // Fetch all pending PTO requests
    const pendingRequests = await PTORequest.findAll({
      where: { status: "Pending" }, // Only fetch requests with status "Pending"
      include: [
        {
          model: User, // Include user details (e.g., name, email)
          as: "user", // Use the alias defined in the association
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]], // Order by most recent requests
    });

    // Log the raw data for debugging
    console.log("Pending PTO Requests:", JSON.stringify(pendingRequests, null, 2));

    res.json(pendingRequests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a PTO request
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Find the PTO request
    const ptoRequest = await PTORequest.findByPk(id);
    if (!ptoRequest) {
      return res.status(404).json({ message: "PTO request not found" });
    }

    // Ensure the logged-in user owns the PTO request
    if (ptoRequest.userId !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to delete this request" });
    }

    // Delete the PTO request
    await ptoRequest.destroy();

    res.json({ message: "PTO request deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Approve or deny a PTO request
router.patch("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, managerComment } = req.body;

    // Validate input
    if (!status || !["Approved", "Denied"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find the PTO request
    const request = await PTORequest.findByPk(id);
    if (!request) {
      return res.status(404).json({ message: "PTO request not found" });
    }

    // Update the request
    request.status = status;
    request.managerComment = managerComment || null;
    await request.save();

    res.json({ message: "PTO request updated successfully", request });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;