import "antd/dist/reset.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home/Home";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import Dashboard from "./Pages/auth/Dashboard";
import BookCab from "./Pages/booking/BookCab";
import Logout from "./Pages/auth/Logout";
import Header from "./components/header/Header";
import About from "./Pages/About";
import { useEffect, useState } from "react";
import AdminDashboard from "./Pages/auth/Admin/AdminDashboard";
import DriverDashboard from "./Pages/auth/Driver/DriverDashboard";
import NotFound from "./Pages/NotFound";
import CarList from "./components/cars/CarList";
import DriverList from "./components/drivers/DriverList";
import BookingList from "./components/bookings/BookingList";
import AdminBookings from "./Pages/admin/AdminBookings";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Reports from "./Pages/admin/Reports";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const userName = localStorage.getItem("userName");
  let userRoles = [];
  const userRolesString = localStorage.getItem("roles");

  if (userRolesString) {
    try {
      userRoles = JSON.parse(userRolesString);
    } catch (error) {
      console.error("Error parsing user roles:", error);
      userRoles = [];
    }
  } else {
    userRoles = [];
  }

  const isCustomer = userRoles.includes("CUSTOMER");
  const isAdmin = userRoles.includes("ADMIN");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuth(token !== null);
  }, []);

  return (
    <div className="App">
      <Header isAuth={isAuth} userName={userName} setIsAuth={setIsAuth} userRoles={userRoles} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/about" element={<About />} />
        {/* Protected Customer Routes */}
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/book-cab" element={isAuth ? <BookCab /> : <Navigate to="/" />} />
        <Route path="/bookings" element={isAuth && (isCustomer || isAdmin) ? <BookingList /> : <Navigate to="/" />} />
        {/* Protected Admin Routes */}
        <Route path="/admin/dashboard" element={isAuth && isAdmin ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/cars" element={isAuth && isAdmin ? <CarList /> : <Navigate to="/" />} />
        <Route path="/drivers" element={isAuth && isAdmin ? <DriverList /> : <Navigate to="/" />} />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute roles={["ADMIN", "CUSTOMER"]}>
              <AdminBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute roles={["ADMIN"]}>
              <Reports />
            </ProtectedRoute>
          }
        />
        {/* Protected Driver Routes */}
        <Route path="/driver/dashboard" element={isAuth && userRoles.includes("DRIVER") ? <DriverDashboard /> : <Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
