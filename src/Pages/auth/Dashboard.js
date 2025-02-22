import React from "react";
import Header from "../../components/header/Header";

const Dashboard = () => {
  return (
    <div>
      <Header isAuth={true} />
      <h2>Dashboard</h2>
      <p>Welcome to your dashboard!</p>
    </div>
  );
};

export default Dashboard;
