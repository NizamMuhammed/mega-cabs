import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axiosConfig";
import { Box, TextField, Button, Typography, Alert, Card, CardContent, CardActions, CircularProgress, Snackbar } from "@mui/material";

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  accent: "#FF6B6B",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

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
              {loading ? <CircularProgress size={24} sx={{ color: colors.text }} /> : "Login"}
            </Button>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "center" }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link to="/register" style={{ color: colors.primary, textDecoration: "none" }}>
              Register now
            </Link>
          </Typography>
        </CardActions>
      </Card>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "right" }} sx={{ marginTop: 8 }}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
