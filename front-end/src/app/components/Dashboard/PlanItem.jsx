"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import PlanDeleteModal from "./PlanDeleteModal";

const PlanItem = ({
  id,
  type,
  title,
  description,
  duration,
  travel_time,
  notes,
  itinerary,
  router,
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const handleOpenDeleteModal = () => setIsDeleteModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteModalOpen(false);

  const handleClick = () => {
    // Redirect to the itinerary page for this trip
    // router.push(`/itinerary/${id}`);
    const encodedData = encodeURIComponent(JSON.stringify(itinerary));
    // Navigate to the 'about' page with query parameters
    router.push(`/itinerary/?itinerary=${encodedData}`);
  };

  return (
    <div>
      <PlanDeleteModal
        show={isDeleteModalOpen}
        hide={handleCloseDeleteModal}
        planID={id}
      />
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
          <Col md={10} onClick={handleClick}>
            <Card.Body>
              <Card.Title>{title}</Card.Title>
              <Card.Text className="text-secondary">
                <span className="d-block">{description}</span> <br />
                {type && <span className="d-block">Type: {type}</span>}
                <span className="d-block">Duration (days): {duration}</span>
                {travel_time && (
                  <span className="d-block">Travel Time: {travel_time}</span>
                )}
                {notes && <span className="d-block">{notes}</span>}
              </Card.Text>
            </Card.Body>
          </Col>

          {/* Edit and Delete icons */}
          <Col
            md={2}
            className="d-flex justify-content-end align-items-start py-2 pr-6"
          >
            <div className="pr-3">
              <Button variant="outline-none" size="sm" className="me-2">
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-none"
                size="sm"
                onClick={handleOpenDeleteModal}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PlanItem;
