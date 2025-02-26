import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
const HRDashboard = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);

  // Fetch all leave policies
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
    leaveType: "",
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
      setFormData({ leaveType: "", maxDaysPerYear: "", carryoverAllowed: false });
      alert("Leave policy created successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to create leave policy");
    }
  };
  
  return (
    <div>
      <h2>HR Dashboard</h2>
      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        style={{ marginBottom: "1rem" }}
      >
        Logout
      </button>
      
      {/* Link to Create a New User */}
      <p style={{ marginTop: "1rem" }}>
        To create a new user,{" "}
        <Link to="/register" style={{ color: "blue", textDecoration: "underline" }}>
          click here
        </Link>
        .
      </p>


      {/* Form to Create a New Leave Policy */}
      <h3>Create Leave Policy</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Leave Type:
          <input
            type="text"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
          />
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
        <label>
          Carryover Allowed:
          <input
            type="checkbox"
            name="carryoverAllowed"
            checked={formData.carryoverAllowed}
            onChange={handleChange}
          />
        </label>
        <button type="submit">Create Policy</button>
      </form>
  
      {/* Section for Managing Leave Policies */}
      <h3>Leave Policies</h3>
      {leavePolicies.length === 0 ? (
        <p>No leave policies found.</p>
      ) : (
        <ul>
          {leavePolicies.map((policy) => (
            <li key={policy.id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>Type:</strong> {policy.leaveType}
              </p>
              <p>
                <strong>Max Days Per Year:</strong> {policy.maxDaysPerYear}
              </p>
              <p>
                <strong>Carryover Allowed:</strong> {policy.carryoverAllowed ? "Yes" : "No"}
              </p>
            </li>
          
          ))}
        </ul>
      )}
    </div>
  );
};

export default HRDashboard;