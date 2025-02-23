import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";
import { Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent } from "@mui/material";

const Header = ({ isAuth }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    handleLogout();
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <>
      <Navbar bg="dark" expand="lg" className="py-2 shadow-sm" style={{ margin: 0, padding: 0 }}>
        <Container fluid style={{ margin: 0 }}>
          <Navbar.Brand href="/" style={{ color: "gold", fontWeight: "bold", fontSize: "24px" }}>
            <LocalTaxiIcon style={{ fontSize: "30px", marginRight: "10px" }} />
            Mega Cabs
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
              {isAuth ? (
                <>
                  <NavLink className="nav-link text-white" activeClassName="active-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                  <NavLink className="nav-link text-white" activeClassName="active-link" to="/book-cab">
                    Booking
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink className="nav-link text-white" activeClassName="active-link" to="/">
                    Home
                  </NavLink>
                  <NavLink className="nav-link text-white" activeClassName="active-link" to="/about">
                    About Us
                  </NavLink>
                </>
              )}
            </Nav>
            <div>
              {isAuth ? (
                <Button variant="outline-light" className="me-2 px-4 py-2" onClick={handleLogoutClick} style={{ fontSize: "16px" }}>
                  Logout
                </Button>
              ) : (
                <>
                  <Button variant="outline-light" className="me-2 px-4 py-2" onClick={() => navigate("/login")} style={{ fontSize: "16px" }}>
                    Login
                  </Button>
                  <Button variant="outline-light" className="px-4 py-2" onClick={() => navigate("/register")} style={{ fontSize: "16px" }}>
                    Register
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Dialog open={showLogoutPopup} onClose={cancelLogout}>
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="primary">
            No
          </Button>
          <Button onClick={confirmLogout} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Header;
