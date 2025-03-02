import React from "react";
import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#1E1E1E",
        color: "white",
      }}
    >
      <Typography variant="h4">404 - Page Not Found</Typography>
    </Box>
  );
};

export default NotFound;
