"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

const TimelineItem = ({
  name,
  duration,
  travel_time,
  notes,
  imageUrl,
  activities
}) => {

  return (
    <div>
      <Card className="mb-3 rounded-5 mx-12">
        <Row className="g-0">
          {/* Image on the left side */}
          {/* <Col md={2} className="d-flex justify-content-center">
            <Image
              width="200"
              height="200"
              src={imageUrl}
              className="img-fluid h-100 rounded"
              alt={title}
            />
          </Col> */}

          {/* Title and description */}
          <Col md={10}>
            <Card.Body>
              <Card.Title className>{name}</Card.Title>
              <Card.Text className="text-secondary">
                <span className="d-block">Duration (days): {duration}</span>
                {travel_time && (
                  <span className="d-block">Travel Time: {travel_time}</span>
                )}
				{notes && <span className="d-block">{notes}</span>}
              </Card.Text>
			  {activities && <span className="d-block"><b>Activities</b><hr></hr></span>}
			  {activities.map((activity, index) => {
					return (
						<span className="text-secondary" key={index}>
							<b>{activity.name}</b><br></br>
								<ul>
									<li>{activity.description}</li>
								</ul>
						</span>
					)
				})}
            </Card.Body>
          </Col>

          {/* Edit and Delete icons */}
        </Row>
      </Card>
    </div>
  );
};

export default TimelineItem;