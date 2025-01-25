import React from "react";
import LoginForm from "../components/LoginForm";
import { Link } from "react-router-dom"; 

const LoginPage = () => {
  return (
    <div>
      <h1>Login to Your Account</h1>
      <LoginForm />
      <p>
        Don't have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
};

export default LoginPage;