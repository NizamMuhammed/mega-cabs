import "../hero/Hero.css";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCab } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const Hero = ({ cabs }) => {
  return (
    <div>
      <Carousel>
        {cabs.map((cab, index) => (
          <Paper elevation={6} key={index}>
            <div className="movie-card-container">
              <div className="movie-card" style={{ "--img": `url(${cab.cabImage[0]})` }}>
                <div className="movie-detail">
                  <div className="movie-poster">
                    <img src={cab.cabImage} alt={cab.cabName} />
                  </div>
                  <div className="movie-title">
                    <h1>{cab.cabBrand}</h1>
                  </div>
                  <div className="play-button-icon-container">
                    <p>{cab.cabType}</p>
                    <div className="movie-buttons-container">
                      <Link to={`/booking/${cab.cabId}`}>
                        <Button variant="contained" color="primary">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
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
