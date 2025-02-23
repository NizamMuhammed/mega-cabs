import "./App.css";
import api from "./api/axiosConfig";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./components/home/Home";
import Layout from "./components/Layout";
import Reviews from "./components/reviewForm/Reviews";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import Dashboard from "./Pages/auth/Dashboard";
import Booking from "./Pages/booking/Booking";

function App() {
  const [cabs, setCabs] = useState();
  const [cab, setCab] = useState();
  const [reviews, setReviews] = useState();

  // Fetch data from backend
  const getCabs = async () => {
    try {
      const response = await api.get("/api/v1/cabs");
      console.log(response.data);
      setCabs(response.data); // Set fetched data in state
    } catch (error) {
      console.error(error);
    }
  };
  const getCabData = async (cabId) => {
    try {
      const response = await api.get(`/api/v1/cabs/${cabId}`);

      const singleCab = response.data;

      setMovie(singleCab);

      setReviews(singleCab.reviews);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCabs();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home cabs={cabs} />} />
          <Route path="/Reviews/:cabId" element={<Reviews getCabData={getCabData} cab={cab} reviews={reviews} setReviews={setReviews} />}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/book-cab" element={<Booking />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
