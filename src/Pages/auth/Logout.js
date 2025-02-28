import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

const Logout = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true); // Dialog is initially open

  useEffect(() => {
    const logout = async () => {
      // Remove JWT from local storage (or cookies)
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userId");

      // Redirect to the home page after a delay
      await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
      navigate("/");

      setOpen(false); // Close dialog
      window.location.reload();
    };

    logout();
  }, [navigate]);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Logging Out</DialogTitle>
        <DialogContent>
          <DialogContentText>Please wait while we log you out...</DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Logout;
