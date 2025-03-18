import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });

      // Log the response for debugging
      console.log(res.data);

      // Save the JWT token to localStorage
      localStorage.setItem("token", res.data.token);

      // Redirect based on the user's role
      if (res.data.role === "Employee") {
        navigate("/employee"); // Redirect to Employee Dashboard
      } else if (res.data.role === "Manager") {
        navigate("/manager"); // Redirect to Manager Dashboard
      } else if (res.data.role === "HR") {
        navigate("/hr"); // Redirect to HR Dashboard
      } else {
        console.error("Unknown role:", res.data.role);
      }
    } catch (err) {
      console.error(err.response?.data?.message || "An error occurred");
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      {/* Login Form */}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>

      
    </div>
  );
};

export default Login;