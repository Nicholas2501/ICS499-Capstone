import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5001/api/reports/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          throw new Error("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.response?.data?.error || error.message || "Failed to fetch users");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
        }
      };

    fetchUsers();
  }, [navigate]);

  // Get current users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="loading">Loading user data...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ color: '#333', marginBottom: '20px' }}>User Reports</h2>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {users.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#f8f9fa' }}>
                <th style={tableHeaderStyle}>ID</th>
                <th style={tableHeaderStyle}>Name</th>
                <th style={tableHeaderStyle}>Email</th>
                <th style={tableHeaderStyle}>Role</th>
                <th style={tableHeaderStyle}>PTO Balance</th>
                <th style={tableHeaderStyle}>Sick Leave</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, index) => (
                <tr 
                  key={user.id}
                  style={{ 
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                    borderBottom: '1px solid #dee2e6'
                  }}
                >
                  <td style={tableCellStyle}>{user.id}</td>
                  <td style={tableCellStyle}>{user.name || 'N/A'}</td>
                  <td style={tableCellStyle}>{user.email || 'N/A'}</td>
                  <td style={tableCellStyle}>{user.role || 'N/A'}</td>
                  <td style={tableCellStyle}>{user.ptoBalance || 0}</td>
                  <td style={tableCellStyle}>{user.sickLeaveBalance || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              style={paginationButtonStyle}
            >
              Previous
            </button>
            
            <span style={{ 
              padding: '8px 16px',
              backgroundColor: '#e9ecef',
              borderRadius: '4px'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              style={paginationButtonStyle}
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No user data available</p>
      )}
    </div>
  );
};

// Style objects
const tableHeaderStyle = {
  padding: '12px',
  border: '1px solid #dee2e6',
  textAlign: 'left',
  backgroundColor: '#495057',
  color: 'white',
  fontWeight: '600'
};

const tableCellStyle = {
  padding: '12px',
  border: '1px solid #dee2e6',
  textAlign: 'left'
};

const paginationButtonStyle = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  ':disabled': {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed'
  }
};

export default Reports;