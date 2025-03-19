import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays } from "date-fns"; // For date calculations
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  // State for submitting a new PTO request
  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    leaveType: "Vacation",
    daysRequested: 0, // Add a field for days requested
  });

  // State for storing the employee's past PTO requests
  const [ptoRequests, setPtoRequests] = useState([]);

  // State for error messages
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle form input changes
  const handleChange = (name, value) => {
    if (name === "startDate" || name === "endDate") {
      // Recalculate daysRequested when dates change
      const updatedFormData = { ...formData, [name]: value };
      const daysRequested =
        name === "endDate" && value
          ? differenceInCalendarDays(value, updatedFormData.startDate) + 1 // Include both start and end dates
          : formData.daysRequested;

      setFormData({ ...updatedFormData, daysRequested });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Fetch the employee's past PTO requests
  useEffect(() => {
    const fetchMyPtoRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/pto-requests/my-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPtoRequests(response.data);
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchMyPtoRequests();
  }, []);

  // Function to submit a new PTO request
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1])); // Decode JWT to get userId
      const userId = decodedToken.id;

      // Send PTO request to the backend
      const response = await axios.post(
        "http://localhost:5001/pto-requests",
        {
          userId,
          startDate: formData.startDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          endDate: formData.endDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
          leaveType: formData.leaveType,
          daysRequested: formData.daysRequested, // Include daysRequested in the request
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message); // Show success message
    } catch (error) {
      // Log the error for debugging
      console.error("Error submitting PTO request:", error.response?.data?.message || error.message);

      // Display the error message in the UI
      if (error.response && error.response.data && error.response.data.message) {
        setErrorMessage(error.response.data.message); // Set the error message
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    // Clear the JWT token from localStorage
    localStorage.removeItem("token");

    // Redirect to the login page
    navigate("/");
  };

  // Function to handle deleting a PTO request
  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem("token");

      // Send a DELETE request to the backend
      await axios.delete(`http://localhost:5001/pto-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Remove the deleted request from the state
      setPtoRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));

      alert("PTO request deleted successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to delete the PTO request");
    }
  };

  return (
    <div>
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: "1rem" }}>
        Logout
      </button>

      {/* Section for Submitting New PTO Requests */}
      <h3>Submit a PTO Request</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Start Date:
          <DatePicker
            selected={formData.startDate}
            onChange={(date) => handleChange("startDate", date)}
            dateFormat="yyyy-MM-dd"
            selectsStart
            startDate={formData.startDate}
            endDate={formData.endDate}
          />
        </label>
        <label>
          End Date:
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleChange("endDate", date)}
            dateFormat="yyyy-MM-dd"
            selectsEnd
            startDate={formData.startDate}
            endDate={formData.endDate}
            minDate={formData.startDate}
          />
        </label>
        <p>
          Days Requested: <strong>{formData.daysRequested}</strong>
        </p>
        <label>
          Leave Type:
          <select
            name="leaveType"
            value={formData.leaveType}
            onChange={(e) => handleChange("leaveType", e.target.value)}
          >
            <option value="Vacation">Vacation</option>
            <option value="Sick Leave">Sick Leave</option>
            <option value="Personal Leave">Personal Leave</option>
          </select>
        </label>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button type="submit">Submit Request</button>
      </form>

      {/* Section for Viewing Past PTO Requests */}
      <h3>My PTO Requests</h3>
      {ptoRequests.length === 0 ? (
        <p>No PTO requests found.</p>
      ) : (
        <ul>
          {ptoRequests.map((request) => (
            <li key={request.id} style={{ marginBottom: "1rem" }}>
              <p>
                <strong>Type:</strong> {request.leaveType}
              </p>
              <p>
                <strong>Dates:</strong> {request.startDate} to {request.endDate}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      request.status === "Approved"
                        ? "green"
                        : request.status === "Denied"
                        ? "red"
                        : "orange",
                  }}
                >
                  {request.status}
                </span>
              </p>
              {request.managerComment && (
                <p>
                  <strong>Manager Comment:</strong> {request.managerComment}
                </p>
              )}
              <button onClick={() => handleDelete(request.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeDashboard;