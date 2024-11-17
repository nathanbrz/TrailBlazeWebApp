"use client";
import React from "react";
import PlanItem from "../Dashboard/PlanItem";
import TimelineItem from "../Dashboard/TimelineItem";
import { Container, Row, Col } from "react-bootstrap";

// Import placeholder photos for each stop
import stopPlaceholder1 from "../../../../public/images/stopPlaceholders/stopPlaceholder1.jpg";
import stopPlaceholder2 from "../../../../public/images/stopPlaceholders/stopPlaceholder2.jpg";
import stopPlaceholder3 from "../../../../public/images/stopPlaceholders/stopPlaceholder3.jpg";
import stopPlaceholder4 from "../../../../public/images/stopPlaceholders/stopPlaceholder4.jpg";
import stopPlaceholder5 from "../../../../public/images/stopPlaceholders/stopPlaceholder5.jpg";
import stopPlaceholder6 from "../../../../public/images/stopPlaceholders/stopPlaceholder6.jpg";
import stopPlaceholder7 from "../../../../public/images/stopPlaceholders/stopPlaceholder7.jpg";
import stopPlaceholder8 from "../../../../public/images/stopPlaceholders/stopPlaceholder8.jpg";
import stopPlaceholder9 from "../../../../public/images/stopPlaceholders/stopPlaceholder9.jpg";
import stopPlaceholder10 from "../../../../public/images/stopPlaceholders/stopPlaceholder10.jpg";

const placeholderImages = [
  stopPlaceholder1,
  stopPlaceholder2,
  stopPlaceholder3,
  stopPlaceholder4,
  stopPlaceholder5,
  stopPlaceholder6,
  stopPlaceholder7,
  stopPlaceholder8,
  stopPlaceholder9,
  stopPlaceholder10,
];

// Helper function to shuffle the images
const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export default function TimelineView({ itinerary = [] }) {

  const shuffledImages = shuffleArray([...placeholderImages]);
  
  return (
    <Container className="relative mt-10">
      {/* Persistent Vertical Line */}
      <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 bg-red-800 w-2 h-full z-0"></div>

      <Row className="relative z-10">
        <Col md={12}>
          {itinerary.map((stop, index) => (
            <div key={index} className="relative mb-10 z-0">
              {/* Render the card (PlanItem) with a lower z-index */}
              <TimelineItem
                name={stop.location}
                duration={stop.stay}
                notes={stop.notes}
                //imageUrl={`/path-to-images/${stop.location.toLowerCase()}.jpg`}
                imageUrl={shuffledImages[index % shuffledImages.length]}
                activities={stop.activities}
                className="z-0" // Ensure PlanItem itself has a lower z-index
              />

              {/* Render the circle for the travel time on a separate line */}
              {index < itinerary.length - 1 && (
                <div className="flex justify-center mt-4 z-0">
                  {/* Travel Time Circle */}
                  <div className="bg-red-800 text-white font-bold rounded-full p-2 text-center w-12 h-12 flex items-center justify-center z-0">
                  {itinerary[index + 1].travel_time}h
                  </div>
                </div>
              )}
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
}