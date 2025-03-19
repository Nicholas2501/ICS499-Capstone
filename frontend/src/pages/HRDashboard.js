import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const HRDashboard = () => {
  const [leavePolicies, setLeavePolicies] = useState([]);
  const navigate = useNavigate();

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
    leaveType: "Sick Leave", // Default value
    maxDaysPerYear: "",
    carryoverAllowed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log("Selected leaveType:", value); // Debugging line
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData); // Debugging line
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5001/api/leave-policies", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeavePolicies([...leavePolicies, response.data.leavePolicy]);
      setFormData({ leaveType: "Sick Leave", maxDaysPerYear: "", carryoverAllowed: false }); // Reset form
      alert("Leave policy created successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to create leave policy");
    }
  };

  // Function to delete a leave policy
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/leave-policies/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the deleted policy from the state
      setLeavePolicies(leavePolicies.filter((policy) => policy.id !== id));
      alert("Leave policy deleted successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to delete leave policy");
    }
  };

  return (
    <div>
      <h2>HR Dashboard</h2>

      {/* Logout Button */}
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
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
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
            style={{ marginLeft: "0.5rem" }}
          >
            <option value="Sick Leave">Sick Leave</option>
            <option value="Vacation">Vacation</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>
        </label>
        <br />
        <label>
          Max Days Per Year:
          <input
            type="number"
            name="maxDaysPerYear"
            value={formData.maxDaysPerYear}
            onChange={handleChange}
            required
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <br />
        <label>
          Carryover Allowed:
          <input
            type="checkbox"
            name="carryoverAllowed"
            checked={formData.carryoverAllowed}
            onChange={handleChange}
            style={{ marginLeft: "0.5rem" }}
          />
        </label>
        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>
          Create Policy
        </button>
      </form>

      {/* Section for Managing Leave Policies */}
      <h3>Leave Policies</h3>
      {leavePolicies.length === 0 ? (
        <p>No leave policies found.</p>
      ) : (
        <ul>
          {leavePolicies.map((policy) => (
            <li key={policy.id} style={{ marginBottom: "1rem", display: "flex", alignItems: "center" }}>
              <div style={{ flexGrow: 1 }}>
                <p>
                  <strong>Type:</strong> {policy.leaveType}
                </p>
                <p>
                  <strong>Max Days Per Year:</strong> {policy.maxDaysPerYear}
                </p>
                <p>
                  <strong>Carryover Allowed:</strong> {policy.carryoverAllowed ? "Yes" : "No"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(policy.id)}
                style={{
                  marginLeft: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ff4d4d",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HRDashboard;