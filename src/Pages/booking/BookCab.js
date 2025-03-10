import React, { useEffect, useState } from "react";
import api from "../../api/axiosConfig";
import { Box, Typography, TextField, Button, Grid, MenuItem, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useMediaQuery } from "@mui/material";

const colors = {
  primary: "#6C63FF",
  secondary: "#2A2A72",
  background: "#1A1A2E",
  text: "#FFFFFF",
  cardBg: "rgba(255, 255, 255, 0.05)",
};

const BookCab = () => {
  const [cabs, setCabs] = useState([]);
  const [price, setPrice] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [bookingValues, setBookingValues] = useState(null);
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
      const selectedCab = cabs.find((cab) => cab.carName === values.cabType);
      const bookingData = {
        pickupLocation: values.pickupLocation,
        dropLocation: values.dropLocation,
        date: values.date,
        time: values.time,
        cabType: values.cabType,
        carBrand: selectedCab.carBrand,
        carName: selectedCab.carName,
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

  const handleConfirmationClose = () => {
    setOpenConfirmation(false);
    setBookingValues(null);
  };

  const handleBookingSubmit = (values, actions) => {
    setBookingValues({ values, actions });
    setOpenConfirmation(true);
  };

  const handleConfirmBooking = async () => {
    if (bookingValues) {
      await handleBooking(bookingValues.values, bookingValues.actions);
      handleConfirmationClose();
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
        background: colors.background,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        transition: "all 0.3s ease-in-out",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: "800px",
          background: "rgba(255, 255, 255, 0.05)",
          borderRadius: "20px",
          padding: "2rem",
          backdropFilter: "blur(10px)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            color: colors.text,
            mb: 4,
            fontWeight: "bold",
            textAlign: "center",
            background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
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
          onSubmit={handleBookingSubmit}
        >
          {({ values, handleChange, handleBlur }) => (
            <Form>
              <Grid container spacing={3} sx={{ mb: 2 }}>
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
                      bgcolor: colors.cardBg,
                      borderRadius: "10px",
                      "& .MuiInputBase-root": {
                        color: colors.text,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                      "& .MuiInputLabel-root": { color: colors.text },
                      transition: "0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(108, 99, 255, 0.05)",
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
                      bgcolor: colors.cardBg,
                      borderRadius: "10px",
                      "& .MuiInputBase-root": {
                        color: colors.text,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                      "& .MuiInputLabel-root": { color: colors.text },
                      transition: "0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(108, 99, 255, 0.05)",
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
                      style: { color: colors.text },
                    }}
                    fullWidth
                    margin="normal"
                    sx={{
                      bgcolor: colors.cardBg,
                      borderRadius: "10px",
                      "& .MuiInputBase-root": {
                        color: colors.text,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                      transition: "0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(108, 99, 255, 0.05)",
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
                      style: { color: colors.text },
                    }}
                    fullWidth
                    margin="normal"
                    sx={{
                      bgcolor: colors.cardBg,
                      borderRadius: "10px",
                      "& .MuiInputBase-root": {
                        color: colors.text,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                      transition: "0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(108, 99, 255, 0.05)",
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
                      bgcolor: colors.cardBg,
                      borderRadius: "10px",
                      "& .MuiInputBase-root": {
                        color: colors.text,
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                      },
                      transition: "0.3s ease",
                      "&:hover": {
                        bgcolor: "rgba(108, 99, 255, 0.05)",
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
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      color: "#00F0FF",
                      textAlign: "center",
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                      background: "rgba(0, 240, 255, 0.1)",
                      padding: "1rem",
                      borderRadius: "10px",
                      marginTop: "1rem",
                    }}
                  >
                    Price: LKR {price}.00
                  </Typography>
                </Grid>

                {/* Submit Button */}
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 2,
                      background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                      color: colors.text,
                      border: "none",
                      padding: "12px",
                      "&:hover": {
                        background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
                        transform: "translateY(-2px)",
                        boxShadow: "0 5px 15px rgba(108, 99, 255, 0.4)",
                      },
                      fontSize: "16px",
                      fontWeight: "bold",
                      transition: "all 0.3s ease",
                      borderRadius: "10px",
                      textTransform: "none",
                    }}
                  >
                    Book Now
                  </Button>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={openConfirmation}
        onClose={handleConfirmationClose}
        PaperProps={{
          sx: {
            background: colors.background,
            color: colors.text,
            borderRadius: "15px",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>Confirm Booking</DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to confirm this booking?
          </Typography>
          <Typography variant="h6" sx={{ color: "#00F0FF", mt: 2 }}>
            Total Amount: LKR {price}.00
          </Typography>
          {bookingValues && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                From: {bookingValues.values.pickupLocation}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                To: {bookingValues.values.dropLocation}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Date: {bookingValues.values.date}
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Time: {bookingValues.values.time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ padding: 2 }}>
          <Button
            onClick={handleConfirmationClose}
            sx={{
              color: colors.text,
              "&:hover": { background: "rgba(255, 255, 255, 0.1)" },
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmBooking}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
              color: colors.text,
              "&:hover": {
                background: `linear-gradient(45deg, ${colors.secondary}, ${colors.primary})`,
              },
            }}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Your booking has been confirmed. Enjoy your ride!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default BookCab;
