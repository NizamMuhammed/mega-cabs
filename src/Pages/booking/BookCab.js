import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Box, Typography, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Paper, Alert, Snackbar, Divider, ListItemIcon, ListItemText, ListItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";

const BookCab = () => {
  const [cabs, setCabs] = useState([]);
  const [price, setPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const locations = [
    { name: "Colombo 1", distance: 1 },
    { name: "Colombo 2", distance: 2 },
    { name: "Colombo 3", distance: 3 },
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
      const response = await api.get("/api/v1/cabs");
      console.log(response.data);
      setCabs(response.data); // Set fetched data in state
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
      const userEmailId = localStorage.getItem("userName"); // Get userEmailId from local storage
      const bookingData = {
        pickupLocation: values.pickupLocation,
        dropLocation: values.dropLocation,
        date: values.date,
        time: values.time,
        cabType: values.cabType,
        price,
        userId: userEmailId, // Add userId to the booking data
      };
      const response = await api.post("/api/v1/bookings", bookingData);
      if (response.status === 200) {
        setBookingSuccess(true);
        setOpenSnackbar(true);
        resetForm();
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000); // Navigate back to dashboard after 3 seconds
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
    <Box sx={{ p: 3, background: "linear-gradient(135deg, #1E1E1E 30%, #333 90%)", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#FFCC00", mb: 3 }}>
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
            {/* removed the Box */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
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
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.name} value={location.name}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="pickupLocation" component="div" style={{ color: "red" }} />
              </Grid>
              <Grid item xs={12}>
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
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                >
                  {locations.map((location) => (
                    <MenuItem key={location.name} value={location.name} disabled={location.name === values.pickupLocation}>
                      {location.name}
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="dropLocation" component="div" style={{ color: "red" }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  type="date"
                  name="date"
                  value={values.date}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  InputLabelProps={{ shrink: true, style: { color: "white" } }}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  inputProps={{ style: { color: "white" } }}
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
                  InputLabelProps={{ shrink: true, style: { color: "white" } }}
                  fullWidth
                  margin="normal"
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  inputProps={{ style: { color: "white" } }}
                />
                <ErrorMessage name="time" component="div" style={{ color: "red" }} />
              </Grid>
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
                  sx={{ bgcolor: "#3A3A3A", borderRadius: 1 }}
                  InputLabelProps={{ style: { color: "white" } }}
                  inputProps={{ style: { color: "white" } }}
                >
                  {cabs.map((cab) => (
                    <MenuItem key={cab.cabId} value={cab.cabName}>
                      <img src={cab.cabImage} alt={`${cab.cabBrand} image`} style={{ width: "50px", height: "30px", marginRight: "10px" }} />
                      {cab.cabBrand} {cab.cabType} ({cab.cabCapacity} seats)
                    </MenuItem>
                  ))}
                </TextField>
                <ErrorMessage name="cabType" component="div" style={{ color: "red" }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Price: LKR {price}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 3, bgcolor: "#FFCC00", color: "black", "&:hover": { bgcolor: "#E6B800" }, fontSize: "16px", fontWeight: "bold" }}
                >
                  Book Now
                </Button>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ top: 80 }} // Adjust the top position
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
          Booking successful! Your price is Rs.{price}.00
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookCab;
