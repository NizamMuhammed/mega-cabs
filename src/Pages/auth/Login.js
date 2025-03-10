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

      const { jwt, userName, roles, userId } = response.data;

      // Store auth data
      localStorage.setItem("jwtToken", jwt);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userId", userId);
      localStorage.setItem("roles", JSON.stringify(roles));

      setIsAuth(true);
      setSuccessMessage("Login successful!");
      setOpenSnackbar(true);

      // Redirect based on role
      const redirectDelay = 1500;
      if (roles.includes("ADMIN")) {
        setTimeout(() => navigate("/admin/dashboard"), redirectDelay);
      } else if (roles.includes("DRIVER")) {
        setTimeout(() => navigate("/driver/dashboard"), redirectDelay);
      } else {
        setTimeout(() => navigate("/dashboard"), redirectDelay);
      }
    } catch (error) {
      console.error("Login Error:", error);
      const errorMessage = error.response?.data || "Login failed. Please try again.";
      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
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
