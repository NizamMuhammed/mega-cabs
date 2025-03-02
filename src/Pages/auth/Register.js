import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Card,
  CardContent,
  CardActions,
  IconButton,
  InputAdornment,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("CUSTOMER"); // Default role is "CUSTOMER"
  const [tabValue, setTabValue] = useState(0); // 0 for Customer, 1 for Driver
  const [licenseNumber, setLicenseNumber] = useState("");
  const [contactInformation, setContactInformation] = useState("");

  const navigate = useNavigate();

  const validateEmail = (email) => {
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateEmail(email)) {
      setErrorMessage("Invalid email format");
      setLoading(false);
      return;
    }
    if (!validatePassword(password)) {
      setErrorMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    const registrationData = {
      userName: username,
      userEmailId: email,
      userPassword: password,
      roles: [selectedRole],
    };

    if (selectedRole === "DRIVER") {
      registrationData.licenseNumber = licenseNumber;
      registrationData.contactInformation = contactInformation;
    }

    try {
      const response = await api.post("/api/v1/auth/register", registrationData);
      console.log("Registration Response:", response.data); // Check the response
      setSuccessMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Registration Error:", error); // Log the full error for debugging
      if (error.response && error.response.status === 400) {
        setErrorMessage("Email already exists.");
      } else {
        setErrorMessage(error.response?.data || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 0) {
      setSelectedRole("CUSTOMER");
    } else {
      setSelectedRole("DRIVER");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" sx={{ background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)" }}>
      <Card
        sx={{
          width: 450,
          p: 4,
          boxShadow: 8,
          bgcolor: "#252525",
          color: "white",
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            Register Now
          </Typography>

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Tabs value={tabValue} onChange={handleTabChange} aria-label="registration-tabs" textColor="secondary" indicatorColor="secondary" sx={{ mb: 2 }}>
            <Tab label="Customer" />
            <Tab label="Driver" />
          </Tabs>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="filled"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="filled"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              error={!validateEmail(email) && email !== ""}
              helperText={!validateEmail(email) && email !== "" ? "Enter a valid email" : ""}
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              error={!validatePassword(password) && password !== ""}
              helperText={!validatePassword(password) && password !== "" ? "Password must be at least 6 characters" : ""}
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type={showPassword ? "text" : "password"}
              variant="filled"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Driver Specific Fields */}
            {tabValue === 1 && (
              <>
                <TextField
                  fullWidth
                  label="License Number"
                  variant="filled"
                  margin="normal"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  required
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                />
                <TextField
                  fullWidth
                  label="Contact Information"
                  variant="filled"
                  margin="normal"
                  value={contactInformation}
                  onChange={(e) => setContactInformation(e.target.value)}
                  required
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                />
              </>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                mt: 3,
                bgcolor: "#FFCC00",
                color: "black",
                "&:hover": { bgcolor: "#E6B800" },
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Register"}
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <a href="/login" style={{ color: "#FFCC00", textDecoration: "none" }}>
              Login here
            </a>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Register;
