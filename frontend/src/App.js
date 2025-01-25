import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import RegisterPage from "./pages/RegisterPage";


// Login Form Component
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear any previous errors

    try {
      // Send login request to the backend
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

// Dashboard Component
const DashboardPage = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [leaveType, setLeaveType] = useState("Vacation");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect to login if no token
        return;
      }

      // Send PTO request to the backend
      const response = await axios.post(
        "http://localhost:5000/api/pto-requests",
        {
          startDate,
          endDate,
          leaveType,
          userId: 1, // Replace with dynamic user ID in a real app
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the request
          },
        }
      );

      alert("PTO Request Submitted!");
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear the token
    navigate("/login"); // Redirect to login
  };

  return (
    <div>
      <h1>Welcome to Your Dashboard</h1>
      <p>You are logged in!</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>Submit a PTO Request</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Leave Type:</label>
          <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Unpaid Leave">Unpaid Leave</option>
          </select>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/" element={<LoginForm />} /> {/* Default to login page */}
      </Routes>
    </Router>
  );
};

export default App;