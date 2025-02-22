import { useEffect, useRef } from "react";
import api from "../../api/axiosConfig.js";
import { useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import ReviewForm from "./ReviewForm.js";
import React from "react";

const Reviews = ({ getCabData, cab, reviews, setReviews }) => {
  const revText = useRef();
  let params = useParams();
  const cabNumber = params.cabNumber;

  useEffect(() => {
    getCabData(cabNumber);
  }, [cabNumber, getCabData]); // Ensure getCabData is included in the dependency array

  const addReview = async (e) => {
    e.preventDefault();
    try {
      const rev = revText.current;
      const response = await api.post("api/v1/reviews", { reviewBody: rev.value, cabId: cabNumber });
      const updatedReviews = [...reviews, { body: rev.value }];
      rev.value = "";
      setReviews(updatedReviews);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <h3>Reviews</h3>
        </Col>
      </Row>
      <Row className="mt-2">
        <Col>
          <img src={cab?.cabImage} alt="" />
        </Col>
        <Col>
          {
            <>
              <Row>
                <Col>
                  <ReviewForm handleSubmit={addReview} revText={revText} labelText="Write Feedback about the Ride" />
                </Col>
              </Row>
              <Row>
                <Col>
                  <hr />
                </Col>
              </Row>
            </>
          }
          {reviews?.map((r, index) => {
            return (
              <div key={index}>
                <Row>
                  <Col>{r.body}</Col>
                </Row>
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
              </div>
            );
          })}
        </Col>
      </Row>
      <Row>
        <Col>
          <hr />
        </Col>
      </Row>
    </Container>
  );
};

export default Reviews;
