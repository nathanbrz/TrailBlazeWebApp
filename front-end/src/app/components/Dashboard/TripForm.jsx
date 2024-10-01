import React, { useState } from "react";
import { Form } from "react-bootstrap";

function TripForm() {
  const [formData, setFormData] = useState({
    startingPosition: "",
    endingPosition: "",
    tripDuration: "",
    tripPreference: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form data:", formData);
    // Form submit logic here
  };

  return (
    <Form onSubmit={handleSubmit} className="mx-4">
      {/* Starting Position */}
      <Form.Group className="mb-3" controlId="startingPosition">
        <Form.Label>Starting Position</Form.Label>
        <Form.Control
          type="text"
          name="startingPosition"
          placeholder="Location Start"
          value={formData.startingPosition}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Ending Position */}
      <Form.Group className="mb-3" controlId="endingPosition">
        <Form.Label>Ending Position</Form.Label>
        <Form.Control
          type="text"
          name="endingPosition"
          placeholder="Location End"
          value={formData.endingPosition}
          onChange={handleChange}
        />
      </Form.Group>
      {/* Ideal Trip Duration */}
      <Form.Group className="mb-3" controlId="tripDuration">
        <Form.Label>Ideal Trip Duration (days)</Form.Label>
        <Form.Control
          type="number"
          name="tripDuration"
          placeholder="20"
          value={formData.tripDuration}
          onChange={handleChange}
        />
      </Form.Group>
      {/* What are you looking for in this trip? */}
      <Form.Group className="mb-3" controlId="tripPreference">
        <Form.Label>What are you looking for in this trip?</Form.Label>
        <Form.Select aria-label="Default select example">
          <option value="">N/A</option>
          <option value="Adventure">Adventure</option>
          <option value="Relaxation">Relaxation</option>
          <option value="Cultural Experience">Cultural Experience</option>
          <option value="Nature">Nature</option>
        </Form.Select>
      </Form.Group>
      <button
        className="btn-blaze w-100 text-white px-3 py-3 rounded-md hover:bg-red-700 transition-colors"
        type="submit"
      >
        Plan
      </button>
    </Form>
  );
}

export default TripForm;
