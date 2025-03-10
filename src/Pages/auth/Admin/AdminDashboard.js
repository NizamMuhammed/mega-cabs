import React from "react";
import { Typography, Box } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" color="white">
        Welcome to the Admin Dashboard!
      </Typography>
    </Box>
  );
};

export default AdminDashboard;
