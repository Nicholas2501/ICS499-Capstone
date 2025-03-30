import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { differenceInCalendarDays } from "date-fns";
import { useNavigate } from "react-router-dom";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    startDate: new Date(),
    endDate: new Date(),
    leaveType: "Vacation",
    daysRequested: 0,
  });

  const [ptoRequests, setPtoRequests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Load CSS from public folder
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/employee.css";
    document.head.appendChild(link);
  }, []);

  const handleChange = (name, value) => {
    if (name === "startDate" || name === "endDate") {
      const updatedFormData = { ...formData, [name]: value };
      const daysRequested =
        name === "endDate" && value
          ? differenceInCalendarDays(value, updatedFormData.startDate) + 1
          : formData.daysRequested;

      setFormData({ ...updatedFormData, daysRequested });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userId = decodedToken.id;

      const response = await axios.post(
        "http://localhost:5001/pto-requests",
        {
          userId,
          startDate: formData.startDate.toISOString().split("T")[0],
          endDate: formData.endDate.toISOString().split("T")[0],
          leaveType: formData.leaveType,
          daysRequested: formData.daysRequested,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting PTO request:", error.response?.data?.message || error.message);
      setErrorMessage(error.response?.data?.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDelete = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/pto-requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPtoRequests((prevRequests) => prevRequests.filter((req) => req.id !== requestId));
      alert("PTO request deleted successfully");
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert("Failed to delete the PTO request");
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Employee Dashboard</h2>
      <button onClick={handleLogout} className="logout-btn">Logout</button>

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

      <h3>My PTO Requests</h3>
      {ptoRequests.length === 0 ? (
        <p>No PTO requests found.</p>
      ) : (
        <ul>
          {ptoRequests.map((request) => (
            <li key={request.id}>
              <p><strong>Type:</strong> {request.leaveType}</p>
              <p><strong>Dates:</strong> {request.startDate} to {request.endDate}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: request.status === "Approved" ? "green" : request.status === "Denied" ? "red" : "orange" }}>
                  {request.status}
                </span>
              </p>
              {request.managerComment && <p><strong>Manager Comment:</strong> {request.managerComment}</p>}
              <button onClick={() => handleDelete(request.id)} className="delete-btn">Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeDashboard;
