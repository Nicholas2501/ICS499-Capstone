const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users");
const ptoRoutes = require("./routes/ptoRequests");
const authRoutes = require("./routes/auth");
const leavePolicyRoutes = require("./routes/leavePolicies");
const reportRoutes = require("./routes/reports");


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes

app.use("/pto-requests", ptoRoutes);
app.use("/api/auth", authRoutes); // Mount the auth routes under /api/auth
app.use("/api/leave-policies", leavePolicyRoutes); // Use the leave policy routes
app.use("/api/reports", reportRoutes);
app.use("/users", userRoutes);
// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});