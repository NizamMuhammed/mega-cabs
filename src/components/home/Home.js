import React from "react";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Typography, Box, Container, Grid, Paper, Button, styled } from "@mui/material";
import { Link } from "react-router-dom";

const HeroPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#3A3A3A",
  color: "white",
  padding: theme.spacing(8, 4),
  textAlign: "center",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundImage: `url(https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2083&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`, // Replace with your image
}));

const FeaturePaper = styled(Paper)(({ theme }) => ({
  backgroundColor: "#3A3A3A",
  color: "white",
  padding: theme.spacing(4, 2),
  textAlign: "center",
  borderRadius: 4,
  boxShadow: "none",
}));

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <HeroPaper elevation={0} sx={{ mb: 4 }}>
        <Container maxWidth="md">
          <Typography component="h1" variant="h2" color="inherit" gutterBottom>
            Mega Cabs
          </Typography>
          <Typography variant="h5" color="inherit" paragraph>
            Your Reliable Ride, Whenever You Need It.
          </Typography>
          <Button
            component={Link}
            to="/book-cab"
            variant="contained"
            color="primary"
            sx={{ bgcolor: "#FFCC00", color: "black", "&:hover": { bgcolor: "#E6B800" }, fontSize: "16px", fontWeight: "bold" }}
          >
            Book a Cab Now
          </Button>
        </Container>
      </HeroPaper>

      {/* Features Section */}
      <Box sx={{ bgcolor: "#252525", py: 6 }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="white" gutterBottom>
            Why Choose Mega Cabs?
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <FeaturePaper>
                <Typography variant="h6">Safe & Secure</Typography>
                <Typography>Verified drivers and real-time tracking for your peace of mind.</Typography>
              </FeaturePaper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FeaturePaper>
                <Typography variant="h6">24/7 Availability</Typography>
                <Typography>We're always here for you, day or night.</Typography>
              </FeaturePaper>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FeaturePaper>
                <Typography variant="h6">Affordable Prices</Typography>
                <Typography>Competitive rates with transparent pricing.</Typography>
              </FeaturePaper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ py: 6, bgcolor: "#333" }}>
        <Container maxWidth="md">
          <Typography variant="h4" align="center" color="white" gutterBottom>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ color: "white" }}>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6">1. Choose Your Location</Typography>
                <Typography>Select your pickup and drop-off points.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6">2. Select Cab and Time</Typography>
                <Typography>Choose your preferred cab type and schedule a time.</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box textAlign="center">
                <Typography variant="h6">3. Confirm & Go</Typography>
                <Typography>Confirm your booking and get ready to go!</Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ py: 6, bgcolor: "#252525" }}>
        <Container maxWidth="md">
          <Box textAlign="center">
            <Typography variant="h4" color="white" gutterBottom>
              Ready to Ride?
            </Typography>
            <Button
              component={Link}
              to="/book-cab"
              variant="contained"
              color="primary"
              sx={{ bgcolor: "#FFCC00", color: "black", "&:hover": { bgcolor: "#E6B800" }, fontSize: "16px", fontWeight: "bold" }}
            >
              Book Now
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
