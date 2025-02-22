// src/components/Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import Register from "./Register.js";
import { Alert, CircularProgress } from "@mui/material";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // To display error messages
  const [loading, setLoading] = useState(false); // To manage loading state
  const [successMessage, setSuccessMessage] = useState(""); // To display success messages
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when the form is submitted
    try {
      const response = await api.post("/api/v1/auth/login", {
        userEmailId: email,
        userPassword: password,
      });
      console.log(response.data);
      if (response.data) {
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          navigate("/dashboard"); // Redirect after a short delay
        }, 2000);
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage(error.response ? error.response.data : "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Login"}
        </button>
      </form>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      <p>
        Don't have an account? <Link to="/register">Register now</Link>
      </p>
    </div>
  );
};

export default Login;
