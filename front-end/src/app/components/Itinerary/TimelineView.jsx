"use client";
import React from "react";
import PlanItem from "../Dashboard/PlanItem";
import { Container, Row, Col } from "react-bootstrap";

export default function TimelineView({ itinerary = [] }) {
  return (
    <Container className="relative mt-10">
      {/* Persistent Vertical Line */}
      <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 bg-red-800 w-2 h-full z-0"></div>

      <Row className="relative z-10">
        <Col md={12}>
          {itinerary.map((stop, index) => (
            <div key={index} className="relative mb-10 z-0">
              {/* Render the card (PlanItem) with a lower z-index */}
              <PlanItem
                id={stop._id}
                title={stop.location}
                description={`Stay at ${
                  stop.hotel
                }. Activities: ${stop.activities
                  .map((a) => a.name)
                  .join(", ")}.`}
                imageUrl={`/path-to-images/${stop.location.toLowerCase()}.jpg`}
                duration={stop.stay}
                travel_time={stop.travel_time}
                notes={stop.notes}
                className="z-0" // Ensure PlanItem itself has a lower z-index
              />

              {/* Render the circle for the travel time on a separate line */}
              {index < itinerary.length - 1 && (
                <div className="flex justify-center mt-4 z-0">
                  {/* Travel Time Circle */}
                  <div className="bg-red-800 text-white font-bold rounded-full p-2 text-center w-12 h-12 flex items-center justify-center z-0">
                    {stop.travel_time}h
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