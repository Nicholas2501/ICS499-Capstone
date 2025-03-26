import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register"; // Import the Register component
import Login from "./pages/Login";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import HRDashboard from "./pages/HRDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Reports from "./pages/Reports";
import "react-datepicker/dist/react-datepicker.css";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route
          path="/employee"
          element={
            <PrivateRoute>
              <EmployeeDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/manager"
          element={
            <PrivateRoute>
              <ManagerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/hr"
          element={
            <PrivateRoute>
              <HRDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/Reports" element={<Reports/>}/>
      </Routes>
    </Router>
  );
};

export default App;