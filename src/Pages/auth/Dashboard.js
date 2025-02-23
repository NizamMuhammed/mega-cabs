import React from "react";
import Header from "../../components/header/Header";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div>
      <Header isAuth={true} />
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
      <Link to="/book-cab">Book a Cab</Link>
    </div>
  );
};

export default Dashboard;
