import React, { useState, useEffect } from "react";
import api from "../../api/axiosConfig";
import {
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import driverService from "../../services/driverService";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";

const Dashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate();

  const fetchDriverDetails = async (bookings) => {
    const updatedBookings = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.driverId) {
          try {
            const driverResponse = await driverService.getDriverById(booking.driverId);
            return {
              ...booking,
              assignedDriver: {
                name: driverResponse.data.driverName,
                phone: driverResponse.data.driverPhone,
              },
            };
          } catch (error) {
            console.error("Error fetching driver details:", error);
            return booking;
          }
        }
        return booking;
      })
    );
    return updatedBookings;
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get("/api/v1/bookings");
        const bookingsWithDrivers = await fetchDriverDetails(response.data);
        // Sort bookings by date and time, most recent first
        const sortedBookings = bookingsWithDrivers.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateB - dateA;
        });
        setBookings(sortedBookings);
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

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.delete(`/api/v1/bookings/${bookingId}`);
      setBookings(bookings.filter((booking) => booking.bookingId !== bookingId));
      setSnackbarMessage("Booking cancelled successfully");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      setSnackbarMessage("Failed to cancel booking");
      setOpenSnackbar(true);
    }
    setOpenDialog(false);
  };

  const handleOpenDialog = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  const getStatusChip = (status) => {
    const statusProps = {
      PENDING: { color: "warning", icon: <PendingIcon /> },
      ASSIGNED: { color: "info", icon: <CheckCircleIcon /> },
      COMPLETED: { color: "success", icon: <CheckCircleIcon /> },
      CANCELLED: { color: "error", icon: <DeleteIcon /> },
    };
    const { color, icon } = statusProps[status] || statusProps.PENDING;
    return <Chip icon={icon} label={status} color={color} size="small" />;
  };

  return (
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)", minHeight: "100vh" }}>
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
            <Paper
              key={booking.bookingId}
              elevation={3}
              sx={{
                mb: 2,
                p: 2,
                background: "#252525",
                color: "white",
                position: "relative",
                "&:hover": {
                  transform: "translateY(-2px)",
                  transition: "transform 0.2s",
                },
              }}
            >
              <Box sx={{ position: "absolute", top: 10, right: 10 }}>{getStatusChip(booking.status)}</Box>

              <ListItem disablePadding>
                <ListItemIcon>
                  <LocalTaxiIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText primary={`Cab Type: ${booking.cabType}`} />
              </ListItem>
              <Divider sx={{ background: "white" }} />
              <ListItem disablePadding sx={{ mt: 2 }}>
                <ListItemIcon>
                  <PersonIcon sx={{ color: "#FFCC00" }} />
                </ListItemIcon>
                <ListItemText
                  primary={booking.assignedDriver ? `Driver: ${booking.assignedDriver.name} (${booking.assignedDriver.phone})` : "Driver: Pending Assignment"}
                  sx={{
                    "& .MuiListItemText-primary": {
                      color: booking.assignedDriver ? "#4CAF50" : "#FFA500",
                    },
                  }}
                />
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
              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                {booking.status !== "CANCELLED" && (
                  <Button startIcon={<DeleteIcon />} color="error" variant="contained" onClick={() => handleOpenDialog(booking)} size="small">
                    Cancel Booking
                  </Button>
                )}
              </Box>
            </Paper>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Cancel Booking</DialogTitle>
        <DialogContent>Are you sure you want to cancel this booking?</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button color="error" onClick={() => selectedBooking && handleCancelBooking(selectedBooking.bookingId)} autoFocus>
            Yes, Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarMessage.includes("success") ? "success" : "error"} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
