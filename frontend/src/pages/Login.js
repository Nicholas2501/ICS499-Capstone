import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Dynamically load CSS from public folder
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "/login.css"; // Path to the CSS file in the public folder
    document.head.appendChild(link);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", { email, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      
      if (res.data.role === "Employee") {
        navigate("/employee");
      } else if (res.data.role === "Manager") {
        navigate("/manager");
      } else if (res.data.role === "HR") {
        navigate("/hr");
      } else {
        console.error("Unknown role:", res.data.role);
      }
    } catch (err) {
      console.error(err.response?.data?.message || "An error occurred");
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-page">
      <div className="header">PTO Tracker System</div>
      <div className="login-container">
        <h2>Login</h2>
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
    </div>
  );
};

export default Login;