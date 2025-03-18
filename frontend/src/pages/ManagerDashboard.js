import React, { useEffect, useState } from "react";
import axios from "axios";

const ManagerDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);

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

  // Function to handle approving or denying a PTO request
  const handleAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem("token");

      // Send a PATCH request to update the status
      const response = await axios.patch(
        `http://localhost:5001/pto-requests/${requestId}`,
        { status: action }, // Set status to "Approved" or "Denied"
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the state to reflect the changes
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
    <div>
      <h2>Manager Dashboard</h2>

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

      {/* Section for Approving/Denying PTO Requests */}
      <h3>Pending PTO Requests</h3>
      {pendingRequests.length === 0 ? (
        <p>No pending PTO requests found.</p>
      ) : (
        <ul>
          {pendingRequests.map((request) => (
            <li key={request.id} style={{ marginBottom: "1rem" }}>
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
              <button onClick={() => handleAction(request.id, "Approved")}>Approve</button>
              <button onClick={() => handleAction(request.id, "Denied")}>Deny</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManagerDashboard;