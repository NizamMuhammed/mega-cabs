import "../hero/Hero.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";

const Hero = ({ cabs }) => {
  return (
    <div className="hero-container">
      <Carousel autoPlay={true} navButtonsAlwaysVisible={true} indicatorIconButtonProps={{ style: { padding: "8px" } }}>
        {cabs.map((cab, index) => (
          <Paper elevation={6} key={index} className="carousel-slide">
            <div className="cab-card" style={{ "--img": `url(${cab.cabImage[0]})` }}>
              <div className="cab-content">
                <div className="cab-image">
                  <img src={cab.cabImage} alt={cab.cabName} />
                </div>
                <div className="cab-details">
                  <h2>{cab.cabBrand}</h2>
                  <p>{cab.cabType}</p>
                  <Link to={`/booking/${cab.cabId}`}>
                    <Button variant="contained" color="primary" className="book-button">
                      Book Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Paper>
        ))}
      </Carousel>
    </div>
  );
};

export default Hero;
