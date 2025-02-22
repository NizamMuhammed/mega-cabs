import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/Header";

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";

  return (
    <div>
      {!isDashboard && <Header />}
      <Outlet />
    </div>
  );
};

export default Layout;
