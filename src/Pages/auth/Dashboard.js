import React, { useEffect, useState } from "react";
import Header from "../../components/header/Header";
import api from "../../api/axiosConfig";
import { Typography, Box, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid, Divider } from "@mui/material";

const Dashboard = () => {
  const [userName, setUserName] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (userId) {
          const response = await api.get(`/api/v1/bookings/user/${userId}`);
          setBookings(response.data);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <Header isAuth={true} userName={userName} />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 3, bgcolor: "#252525", color: "white", borderRadius: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Dashboard
          </Typography>
          <Divider sx={{ mb: 2, bgcolor: "#FFCC00" }} />
          {userName && (
            <Typography variant="h6" gutterBottom>
              Welcome, <span style={{ color: "#FFCC00" }}>{userName}</span>!
            </Typography>
          )}

          {/* Display Bookings */}
          <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Your Bookings
          </Typography>
          {bookings.length === 0 ? (
            <Typography>No bookings found.</Typography>
          ) : (
            <TableContainer component={Paper} sx={{ bgcolor: "#3A3A3A", color: "white" }}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead sx={{ bgcolor: "#404040" }}>
                  <TableRow>
                    <TableCell sx={{ color: "white" }}>Pickup Location</TableCell>
                    <TableCell sx={{ color: "white" }} align="right">
                      Drop Location
                    </TableCell>
                    <TableCell sx={{ color: "white" }} align="right">
                      Date
                    </TableCell>
                    <TableCell sx={{ color: "white" }} align="right">
                      Time
                    </TableCell>
                    <TableCell sx={{ color: "white" }} align="right">
                      Cab Type
                    </TableCell>
                    <TableCell sx={{ color: "white" }} align="right">
                      Price
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.bookingId} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <TableCell component="th" scope="row" sx={{ color: "white" }}>
                        {booking.pickupLocation}
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        {booking.dropLocation}
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        {booking.date}
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        {booking.time}
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        {booking.cabType}
                      </TableCell>
                      <TableCell sx={{ color: "white" }} align="right">
                        {booking.price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Dashboard;
