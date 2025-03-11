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

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  accent: "#FF6B6B",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

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
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{
        background: `linear-gradient(135deg, ${colors.background}, ${colors.secondary})`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 50% 50%, rgba(108, 99, 255, 0.1) 0%, rgba(26, 26, 46, 0) 70%)",
        }}
      />
      <Card
        sx={{
          width: 450,
          p: 4,
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          bgcolor: "rgba(37, 37, 37, 0.9)",
          color: colors.text,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.1)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              color: colors.text,
              textShadow: "0 0 20px rgba(108, 99, 255, 0.5)",
              fontWeight: "800",
              mb: 4,
            }}
          >
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

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              mb: 2,
              "& .MuiTab-root": { color: colors.text },
              "& .Mui-selected": { color: colors.primary },
              "& .MuiTabs-indicator": { backgroundColor: colors.primary },
            }}
          >
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
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                color: colors.text,
                height: "50px",
                fontSize: "16px",
                fontWeight: "bold",
                border: "none",
                boxShadow: "0 10px 20px rgba(108, 99, 255, 0.2)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 30px rgba(108, 99, 255, 0.3)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: colors.text }} /> : "Register"}
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <a href="/login" style={{ color: colors.primary, textDecoration: "none" }}>
              Login here
            </a>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Register;
