import "../hero/Hero.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Hero = ({ cabs }) => {
  return (
    <div>
      <Carousel>
        {cabs.map((cab, index) => (
          <Paper elevation={6} key={index}>
            <div>
              <img src={cab.cabImage} alt={cab.cabName} />
            </div>
            <h1>{cab.cabBrand}</h1>
            <p>{cab.cabType}</p>
            <Link to={`/booking/${cab.cabId}`}>
              <Button variant="contained" color="primary">
                Book Now
              </Button>
            </Link>
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
