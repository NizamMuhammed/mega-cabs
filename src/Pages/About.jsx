import React from "react";
import { Box, Typography, Container, Grid, Paper, Avatar, Divider } from "@mui/material";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

const About = () => {
  return (
    <Box
      sx={{
        bgcolor: "#1E1E1E", // Dark background
        color: "white",
        minHeight: "100vh",
        py: 8, // Padding top and bottom
      }}
    >
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 6, // Margin bottom
          }}
        >
          <Typography variant="h3" sx={{ color: "#FFCC00", fontWeight: "bold", mb: 2 }}>
            About MegaCabs
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 800, mx: "auto" }}>
            MegaCabs is a leading transportation service committed to providing safe, reliable, and convenient rides for everyone. Our mission is to redefine your travel experience through
            cutting-edge technology and exceptional customer care.
          </Typography>
        </Box>

        {/* Our Values Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ color: "#FFCC00", fontWeight: "bold", mb: 4 }}>
            Our Core Values
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, bgcolor: "#252525", textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "#FFCC00",
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <LocalTaxiIcon sx={{ fontSize: 40, color: "black" }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Reliability
                </Typography>
                <Typography variant="body2">We prioritize punctuality and dependable service.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, bgcolor: "#252525", textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "#FFCC00",
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <SecurityIcon sx={{ fontSize: 40, color: "black" }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Safety
                </Typography>
                <Typography variant="body2">Your safety is our top priority. We maintain high standards.</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Paper sx={{ p: 3, bgcolor: "#252525", textAlign: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "#FFCC00",
                    width: 60,
                    height: 60,
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <SupportAgentIcon sx={{ fontSize: 40, color: "black" }} />
                </Avatar>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Customer Care
                </Typography>
                <Typography variant="body2">We're here for you with responsive support and personalized service.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        {/* Our Story Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ color: "#FFCC00", fontWeight: "bold", mb: 4 }}>
            Our Story
          </Typography>
          <Paper sx={{ p: 4, bgcolor: "#252525" }}>
            <Typography variant="body1">
              MegaCabs was founded in 2024 with a vision to transform urban transportation. We started with a small fleet and a big dream, and we have grown into a trusted provider by focusing on our
              core values.
            </Typography>
            <Divider sx={{ my: 3, bgcolor: "white" }} />
            <Typography variant="body1">
              Today, we serve thousands of passengers daily, continuously innovating to make your rides even better. We are proud of our journey and grateful for the trust our customers place in us.
            </Typography>
          </Paper>
        </Box>

        {/* Contact Us Section */}
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ color: "#FFCC00", fontWeight: "bold", mb: 2 }}>
            Contact Us
          </Typography>
          <Typography variant="body1">Have questions or feedback? Reach out to us!</Typography>
          <Typography variant="body1" sx={{ mt: 1 }}>
            Email: support@megacabs.com
          </Typography>
          <Typography variant="body1">Phone: +1-123-456-7890</Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
