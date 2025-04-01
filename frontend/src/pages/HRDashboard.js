import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const HRDashboard = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const navigate = useNavigate();

  // Load CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/hr.css";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchLeavePolicies = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/leave-policies", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLeavePolicies(response.data);
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchLeavePolicies();
  }, []);

  const [formData, setFormData] = useState({
    leaveType: "Sick Leave",
    maxDaysPerYear: "",
    carryoverAllowed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5001/api/leave-policies", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeavePolicies([...leavePolicies, response.data.leavePolicy]);
      setFormData({ leaveType: "Sick Leave", maxDaysPerYear: "", carryoverAllowed: false });
      alert("Leave policy created successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to create leave policy");
    }
  };

<<<<<<< HEAD
=======

  // Function to delete a leave policy
>>>>>>> db679fcff95845d35f04f0776c2d35457f6b0d39
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/leave-policies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeavePolicies(leavePolicies.filter((policy) => policy.id !== id));
      alert("Leave policy deleted successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to delete leave policy");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>HR Dashboard</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="logout-btn"
      >
        Logout
      </button>

<<<<<<< HEAD
      <p className="create-user-link">
        To create a new user, <Link to="/register">click here</Link>.
=======
      <button onClick={ () => {
        navigate("/Reports");
      }}
      style={{marginBottom: "1rem"}}
      >
        Reports
      </button>

      {/* Link to Create a New User */}
      <p style={{ marginTop: "1rem" }}>
        To create a new user,{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          click here
        </Link>
        .
>>>>>>> db679fcff95845d35f04f0776c2d35457f6b0d39
      </p>

      <h3>Create Leave Policy</h3>
      <form onSubmit={handleSubmit} className="hr-form">
        <label>
          Leave Type:
          <select name="leaveType" value={formData.leaveType} onChange={handleChange} required>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>
        </label>

        <label>
          Max Days Per Year:
          <input
            type="number"
            name="maxDaysPerYear"
            value={formData.maxDaysPerYear}
            onChange={handleChange}
            required
          />
        </label>

        <label className="checkbox-label">
          <input
            type="checkbox"
            name="carryoverAllowed"
            checked={formData.carryoverAllowed}
            onChange={handleChange}
          />
          Carryover Allowed
        </label>

        <button type="submit" className="submit-btn">Create Policy</button>
      </form>

      <h3>Leave Policies</h3>
      {leavePolicies.length === 0 ? (
        <p>No leave policies found.</p>
      ) : (
        <ul>
          {leavePolicies.map((policy) => (
            <li key={policy.id}>
              <p><strong>Type:</strong> {policy.leaveType}</p>
              <p><strong>Max Days Per Year:</strong> {policy.maxDaysPerYear}</p>
              <p><strong>Carryover Allowed:</strong> {policy.carryoverAllowed ? "Yes" : "No"}</p>
              <button onClick={() => handleDelete(policy.id)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HRDashboard;
