"use client";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import MessageAlert from "../MessageAlert";
import { useApi } from "../../hooks/useApi";

function TripForm() {
  const [formData, setFormData] = useState({
    startingPosition: "",
    endingPosition: "",
    tripDuration: "",
    tripPreference: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
  });

  const { data, loading, error, responseStatus, fetchData: submitTrip } = useApi("api/trips", "POST");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Trigger the API request with the latest formData as body
    await submitTrip({
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        start_location: formData.startingPosition,
        end_location: formData.endingPosition,
        total_duration: Number(formData.tripDuration),
        trip_interest: formData.tripPreference,
      },
    });

    // Check the response and handle success/error
    if (responseStatus === 200 || responseStatus === 201) {
      // Reset form data after successful submission
      setFormData({
        startingPosition: "",
        endingPosition: "",
        tripDuration: "",
        tripPreference: "",
      });
      setAlert({
        show: true,
        message: "Trip planned successfully!",
        variant: "success",
      });
    } else if (responseStatus >= 400) {
      setAlert({
        show: true,
        message: error || "Error planning trip. Please try again.",
        variant: "danger",
      });
    }
  };

  return alert.show ? (
    <MessageAlert
      variant={alert.variant}
      message={alert.message}
      show={alert.show}
      setShow={(value) => setAlert({ ...alert, show: value })}
    />
  ) : (
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
        <Form.Select
          name="tripPreference"
          value={formData.tripPreference}
          onChange={handleChange}
          aria-label="Default select example"
        >
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
        disabled={loading}
      >
        {loading ? "Planning..." : "Plan"}
      </button>
    </Form>
  );
}

export default TripForm;