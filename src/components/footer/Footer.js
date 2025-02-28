import React from "react";
import { Typography, Box, Container, Link, Grid } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#252525",
        color: "white",
        py: 3,
        mt: 8, // Add margin top for spacing
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#FFCC00" gutterBottom>
              Mega Cabs
            </Typography>
            <Typography variant="body2">Your trusted partner for safe and reliable transportation.</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#FFCC00" gutterBottom>
              Quick Links
            </Typography>
            <Box display="flex" flexDirection="column">
              <Link href="#" color="inherit" underline="none" sx={{ mb: 1 }}>
                Home
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="#" color="inherit" underline="none" sx={{ mb: 1 }}>
                Contact
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="#FFCC00" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2">
              Email: info@megacabs.com
              <br />
              Phone: +94 11 123 4567
            </Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {"Copyright © "}
          {new Date().getFullYear()}
          {" Mega Cabs. All rights reserved."}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
