import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  return (
    <Navbar bg="dark" expand="lg" className="py-2 shadow-sm" style={{ margin: 0, padding: 0 }}>
      <Container fluid style={{ margin: 0 }}>
        <Navbar.Brand href="/" style={{ color: "gold", fontWeight: "bold", fontSize: "24px" }}>
          <LocalTaxiIcon style={{ fontSize: "30px", marginRight: "10px" }} />
          Mega Cabs
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: "100px" }} navbarScroll>
            <NavLink className="nav-link text-white" activeClassName="active-link" to="/">
              Home
            </NavLink>
            <NavLink className="nav-link text-white" activeClassName="active-link" to="/watchList">
              Watch List
            </NavLink>
          </Nav>
          <div>
            <Button variant="outline-light" className="me-2 px-4 py-2" onClick={() => navigate("/login")} style={{ fontSize: "16px" }}>
              Login
            </Button>
            <Button variant="outline-light" className="px-4 py-2" onClick={() => navigate("/register")} style={{ fontSize: "16px" }}>
              Register
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
