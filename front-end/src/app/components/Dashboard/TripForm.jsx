"use client";
import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import MessageAlert from "../MessageAlert";
import { useApi } from "../../hooks/useApi";
import Select from "react-select";
import northAmericanCities from "../../../data/northAmericanCities";

// List of cities for autocomplete
const cities = northAmericanCities.map((city) => ({
  value: city,
  label: city,
}));

function TripForm() {
  const [formData, setFormData] = useState({
    startingPosition: null,
    endingPosition: null,
    tripDuration: "10",
    tripPreference: "",
  });

  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
  });

  const { data, loading, error, responseStatus, fetchData: submitTrip } = useApi("api/trips", "POST");

  const handleChange = (selectedOption, name) => {
    setFormData({
      ...formData,
      [name]: selectedOption,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.tripDuration < 1 || formData.tripDuration > 20) {
      setAlert({
        show: true,
        message: "Trip duration must be between 1 and 20 days.",
        variant: "danger",
      });
      return;
    }

    if (formData.startingPosition == null || formData.endingPosition == null) {
      setAlert({
        show: true,
        message: "Please select a starting and ending city.",
        variant: "danger",
      });
      return;
    }
    
    await submitTrip({
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        start_location: formData.startingPosition?.value,
        end_location: formData.endingPosition?.value,
        total_duration: Number(formData.tripDuration),
        trip_interest: formData.tripPreference,
      },
    });

    if (responseStatus === 200 || responseStatus === 201) {
      setFormData({
        startingPosition: null,
        endingPosition: null,
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

  // Reload the page when `loading` turns from `true` to `false` after a successful response
  useEffect(() => {
    if (!loading && (responseStatus === 200 || responseStatus === 201)) {
      window.location.reload();
    }
  }, [loading, responseStatus]);

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
        <Form.Label>Start City</Form.Label>
        <Select
          options={cities}
          value={formData.startingPosition}
          onChange={(option) => handleChange(option, 'startingPosition')}
          placeholder="Select a city in North America..."
        />
      </Form.Group>
      {/* Ending Position */}
      <Form.Group className="mb-3" controlId="endingPosition">
        <Form.Label>End City</Form.Label>
        <Select
          options={cities}
          value={formData.endingPosition}
          onChange={(option) => handleChange(option, 'endingPosition')}
          placeholder="Select a city in North America..."
        />
      </Form.Group>
      {/* Ideal Trip Duration (1 - 20 Days) */}
      <Form.Group className="mb-3" controlId="tripDuration">
        <Form.Label>Ideal Trip Duration (1 - 20 days)</Form.Label>
        <Form.Control
          type="number"
          name="tripDuration"
          placeholder="10"
          value={formData.tripDuration}
          onChange={(e) => setFormData({ ...formData, tripDuration: e.target.value })}
          min={1}
          max={20}
        />
      </Form.Group>
      {/* What are you looking for in this trip? */}
      <Form.Group className="mb-3" controlId="tripPreference">
        <Form.Label>What are you looking for in this trip?</Form.Label>
        <Form.Select
          name="tripPreference"
          value={formData.tripPreference}
          onChange={(e) => setFormData({ ...formData, tripPreference: e.target.value })}
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