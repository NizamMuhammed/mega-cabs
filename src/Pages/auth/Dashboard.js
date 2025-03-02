import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import { Typography, Box, Paper, List, ListItem, ListItemText, ListItemIcon, Divider, Button } from "@mui/material";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/v1/bookings"); // Use api.get, not axios.get
        console.log("Bookings:", response.data); // add this to check the response
        setBookings(response.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message || "An error occurred while fetching bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleBookNowClick = () => {
    navigate("/book-cab");
  };

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)",
        minHeight: "100vh",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#FFCC00", textAlign: "center" }}>
          Your Bookings
        </Typography>
        <Button variant="contained" color="primary" onClick={handleBookNowClick}>
          Book Now
        </Button>
      </Box>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body1" color="white">
            Loading bookings...
          </Typography>
        </Box>
      )}

      {error && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {!loading && !error && bookings.length === 0 && (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
          <Typography variant="body1" color="white" sx={{ mb: 2 }}>
            No bookings found.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleBookNowClick}>
            Book Now
          </Button>
        </Box>
      )}

      {!loading && !error && bookings.length > 0 && (
        <List>
          {bookings.map((booking) => (
            <Paper key={booking.bookingId} elevation={3} sx={{ mb: 2, p: 2, background: "#252525", color: "white" }}>
              <ListItem disablePadding>
                <ListItemIcon>
                  <LocalTaxiIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText primary={`Cab Type: ${booking.cabType}`} />
              </ListItem>
              <Divider sx={{ background: "white" }} />
              <ListItem disablePadding>
                <ListItemIcon>
                  <DateRangeIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText primary={`Date: ${booking.date}`} />
              </ListItem>
              <Divider sx={{ background: "white" }} />
              <ListItem disablePadding>
                <ListItemIcon>
                  <AccessTimeIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText primary={`Time: ${booking.time}`} />
              </ListItem>
              <Divider sx={{ background: "white" }} />
              <ListItem disablePadding>
                <ListItemIcon>
                  <ConfirmationNumberIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText primary={`Price: ${booking.price}`} />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Dashboard;
