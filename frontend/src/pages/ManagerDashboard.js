import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

  // Load manager CSS
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/manager.css";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/pto-requests/pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingRequests(response.data);
      } catch (error) {
        console.error(error.response?.data?.message || "An error occurred");
      }
    };

    fetchPendingRequests();
  }, []);

  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5001/pto-requests/${requestId}`,
        { status: action },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPendingRequests((prevRequests) =>
        prevRequests.map((request) =>
          request.id === requestId ? { ...request, status: action } : request
        )
      );

      alert(`${action} successfully`);
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
      alert(`Failed to ${action.toLowerCase()} the request`);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Manager Dashboard</h2>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}
        className="logout-btn"
      >
        Logout
      </button>

      <h3>Pending PTO Requests</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending PTO requests found.</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id}>
              <p>
                <strong>User:</strong> {request.user.name} ({request.user.email})
              </p>
              <p>
                <strong>Type:</strong> {request.leaveType}
              </p>
              <p>
                <strong>Dates:</strong> {request.startDate} to {request.endDate}
              </p>
              <p>
                <strong>Status:</strong> {request.status}
              </p>
              <div className="action-buttons">
                <button onClick={() => handleAction(request.id, "Approved")} className="approve-btn">
                  Approve
                </button>
                <button onClick={() => handleAction(request.id, "Denied")} className="deny-btn">
                  Deny
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerDashboard;
