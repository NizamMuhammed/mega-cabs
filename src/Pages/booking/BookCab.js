import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Box, Typography, TextField, Button, Grid, MenuItem, Snackbar, Alert, FormControl, InputLabel, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMediaQuery } from "@mui/material";

const BookCab = () => {
  const [cabs, setCabs] = useState([]);
  const [price, setPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  const locations = [
    { name: "Colombo Fort", distance: 1 },
    { name: "Slave Island", distance: 2 },
    { name: "Kollupitiya", distance: 3 },
    { name: "Dehiwala", distance: 4 },
    { name: "Mount Lavinia", distance: 5 },
    { name: "Moratuwa", distance: 6 },
    { name: "Negombo", distance: 7 },
    { name: "Wattala", distance: 8 },
    { name: "Battaramulla", distance: 9 },
    { name: "Kaduwela", distance: 10 },
    { name: "Homagama", distance: 11 },
    { name: "Maharagama", distance: 12 },
    { name: "Piliyandala", distance: 13 },
    { name: "Kesbewa", distance: 14 },
    { name: "Panadura", distance: 15 },
    { name: "Kalutara", distance: 16 },
  ];

  const getCabs = async () => {
    try {
      const response = await api.get("/api/v1/cars");
      const availableCabs = response.data.filter((cab) => cab.isAvailable === true);
      setCabs(availableCabs);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCabs();
  }, []);

  const calculatePrice = (pickupLocation, dropLocation) => {
    if (pickupLocation && dropLocation && pickupLocation !== dropLocation) {
      const pickup = locations.find((loc) => loc.name === pickupLocation);
      const drop = locations.find((loc) => loc.name === dropLocation);
      if (pickup && drop) {
        const distance = Math.abs(pickup.distance - drop.distance);
        setPrice(distance * 212); // Example price calculation based on distance
      }
    } else {
      setPrice(0); // Reset price if locations are the same
    }
  };

  const handleBooking = async (values, { resetForm }) => {
    try {
      const userEmailId = localStorage.getItem("userName");
      const bookingData = {
        pickupLocation: values.pickupLocation,
        dropLocation: values.dropLocation,
        date: values.date,
        time: values.time,
        cabType: values.cabType,
        price,
        userId: userEmailId,
      };
      const response = await api.post("/api/v1/bookings", bookingData);
      if (response.status === 200) {
        setBookingSuccess(true);
        setOpenSnackbar(true);
        resetForm();
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const getCurrentTime = () => {
    const today = new Date();
    return today.toTimeString().split(" ")[0].slice(0, 5);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const validationSchema = Yup.object({
    pickupLocation: Yup.string().required("Pickup location is required"),
    dropLocation: Yup.string().required("Drop location is required"),
    date: Yup.string().required("Date is required"),
    time: Yup.string().required("Time is required"),
    cabType: Yup.string().required("Cab type is required"),
  });

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)", // Futuristic gradient background
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.5s ease-in-out",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
      }}
    >
      <Typography variant="h4" gutterBottom sx={{ color: "#00F0FF", mb: 3, fontFamily: "'Orbitron', sans-serif", letterSpacing: 3 }}>
        Book a Cab
      </Typography>

      <Formik
        initialValues={{
          pickupLocation: "",
          dropLocation: "",
          date: getCurrentDate(),
          time: getCurrentTime(),
          cabType: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => handleBooking(values, actions)}
      >
        {({ values, handleChange, handleBlur }) => (
          <Form>
            <Grid container spacing={3}>
              {/* Pickup Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Pickup Location"
                  name="pickupLocation"
                  value={values.pickupLocation}
                  onChange={(e) => {
                    handleChange(e);
                    calculatePrice(e.target.value, values.dropLocation);
                  }}
                  onBlur={handleBlur}
                  fullWidth
                  margin="normal"
                  sx={{
                    bgcolor: "#1F1F1F", // Dark background for inputs
                    borderRadius: 1,
                    "& .MuiInputBase-root": { color: "white" },
                    "& .MuiInputLabel-root": { color: "white" },
                    transition: "0.3s ease",
                    "&:hover": {
                      bgcolor: "#333", // Slightly lighter on hover for emphasis
                    },
                  }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.name} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="pickupLocation" component="div" style={{ color: "red" }} />
              </Grid>

              {/* Drop Location */}
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Drop Location"
                  name="dropLocation"
                  value={values.dropLocation}
                  onChange={(e) => {
                    handleChange(e);
                    calculatePrice(values.pickupLocation, e.target.value);
                  }}
                  onBlur={handleBlur}
                  fullWidth
                  margin="normal"
                  sx={{
                    bgcolor: "#1F1F1F", // Dark background for inputs
                    borderRadius: 1,
                    "& .MuiInputBase-root": { color: "white" },
                    "& .MuiInputLabel-root": { color: "white" },
                    transition: "0.3s ease",
                    "&:hover": {
                      bgcolor: "#333", // Slightly lighter on hover for emphasis
                    },
                  }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.name} value={location.name} disabled={location.name === values.pickupLocation}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="dropLocation" component="div" style={{ color: "red" }} />
              </Grid>

              {/* Date and Time */}
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "white" },
                  }}
                  fullWidth
                  margin="normal"
                  sx={{
                    bgcolor: "#1F1F1F",
                    borderRadius: 1,
                    "& .MuiInputBase-root": { color: "white" },
                    transition: "0.3s ease",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                />
                <ErrorMessage name="date" component="div" style={{ color: "red" }} />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Time"
                  type="time"
                  name="time"
                  value={values.time}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputLabelProps={{
                    shrink: true,
                    style: { color: "white" },
                  }}
                  fullWidth
                  margin="normal"
                  sx={{
                    bgcolor: "#1F1F1F",
                    borderRadius: 1,
                    "& .MuiInputBase-root": { color: "white" },
                    transition: "0.3s ease",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                />
                <ErrorMessage name="time" component="div" style={{ color: "red" }} />
              </Grid>

              {/* Cab Type Selection */}
              <Grid item xs={12}>
                <TextField
                  select
                  label="Cab Type"
                  name="cabType"
                  value={values.cabType}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  fullWidth
                  margin="normal"
                  sx={{
                    bgcolor: "#1F1F1F",
                    borderRadius: 1,
                    "& .MuiInputBase-root": { color: "white" },
                    transition: "0.3s ease",
                    "&:hover": {
                      bgcolor: "#333",
                    },
                  }}
                >
                  {cabs.map((cab) => (
                    <MenuItem key={cab.carId} value={cab.carName}>
                      <img src={cab.carImage} alt={`${cab.carBrand} image`} style={{ width: "50px", height: "30px", marginRight: "10px" }} />
                      {cab.carBrand} {cab.carName} ({cab.carType})
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="cabType" component="div" style={{ color: "red" }} />
              </Grid>

              {/* Price */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ color: "#00F0FF" }}>
                  Price: LKR {price}
                </Typography>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    mt: 3,
                    bgcolor: "#00F0FF",
                    color: "black",
                    "&:hover": {
                      bgcolor: "#00C0C0", // Neon-like hover effect
                    },
                    fontSize: "16px",
                    fontWeight: "bold",
                    transition: "0.3s ease",
                  }}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} message="Booking successful!">
        <Alert severity="success" sx={{ width: "100%" }}>
          Your booking has been confirmed. Enjoy your ride!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookCab;
