import "./App.css";
import { Routes, Route } from "react-router-dom"; //corrected
import Home from "./components/home/Home";
import Login from "./Pages/auth/Login";
import Register from "./Pages/auth/Register";
import Dashboard from "./Pages/auth/Dashboard";
import BookCab from "./Pages/booking/BookCab"; // Corrected import
import Logout from "./Pages/auth/Logout";
import Header from "./components/header/Header";
import About from "./Pages/About";
import { useEffect, useState } from "react";

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const userName = localStorage.getItem("userName");

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    setIsAuth(token !== null);
  }, []);

  return (
    <div className="App">
      <Header isAuth={isAuth} userName={userName} setIsAuth={setIsAuth} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setIsAuth={setIsAuth} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout setIsAuth={setIsAuth} />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={isAuth ? <Dashboard /> : <Login setIsAuth={setIsAuth} />} />
        <Route path="/book-cab" element={isAuth ? <BookCab /> : <Login setIsAuth={setIsAuth} />} />
      </Routes>
    </div>
  );
}

export default App;
