import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Box, TextField, Button, Typography, Alert, Card, CardContent, CardActions, CircularProgress, Snackbar } from "@mui/material";

const Login = ({ setIsAuth }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await api.post("/api/v1/auth/login", {
        userEmailId: email,
        userPassword: password,
      });

      console.log("Login Response:", response.data);
      const token = response.data.jwt;
      const name = response.data.userName;
      //const roles = response.data.roles.map(role => role.name); // Get the roles from the response
      const roles = response.data.roles.map((role) => role); // Extracting role names // no need for the name
      const userId = response.data.userId; // get the userId from the response

      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userName", name);
      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", JSON.stringify(roles)); // Store roles as a string
      setIsAuth(true);
      setSuccessMessage("Login successful!");
      setOpenSnackbar(true);

      // Determine the redirect path based on roles
      if (roles.includes("ADMIN")) {
        setTimeout(() => {
          navigate("/admin/dashboard");
        }, 3000);
      } else if (roles.includes("DRIVER")) {
        setTimeout(() => {
          navigate("/driver/dashboard");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/dashboard"); // Default to customer dashboard
        }, 3000);
      }
    } catch (error) {
      console.error("Login Error:", error);

      if (error.response) {
        console.error("Server Response:", error.response);
        if (error.response.status === 401) {
          setErrorMessage("Invalid email or password");
        } else if (error.response.status === 400) {
          setErrorMessage(error.response.data ? error.response.data : "Bad Request");
        } else if (error.response.status === 404) {
          setErrorMessage("User not found");
        } else if (error.response.status === 403) {
          setErrorMessage("User account is disabled or locked");
        } else if (error.response.status === 500) {
          setErrorMessage("Internal Server Error. Please try again later.");
        } else {
          setErrorMessage(`Server responded with error status: ${error.response.status}`);
        }
      } else if (error.request) {
        console.error("No Response Received:", error.request);
        setErrorMessage("Network error. Please check your internet connection and try again.");
      } else {
        console.error("Error Setting Up Request:", error.message);
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
    setLoading(false);
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
            Login
          </Typography>

          {errorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              variant="filled"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              variant="filled"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
              InputLabelProps={{ style: { color: "white" } }}
              inputProps={{ style: { color: "white" } }}
            />

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
              {loading ? <CircularProgress size={24} sx={{ color: "black" }} /> : "Login"}
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#FFCC00", textDecoration: "none" }}>
              Register now
            </Link>
          </Typography>
        </CardActions>
      </Card>

      {/* Snackbar for Success Message */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ marginTop: 8 }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
