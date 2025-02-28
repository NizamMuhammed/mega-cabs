import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      // Clear JWT from local storage (or cookies)
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      // Redirect to the home page
      navigate("/");
    };

    handleLogout();
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
