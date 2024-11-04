"use client";
import React, { useState } from "react";
import PlanItem from "./PlanItem";
import { useApi } from "../../hooks/useApi";
import MessageAlert from "../MessageAlert";

export default function PlanListSection({ router }) {
  // State to control showing/hiding alerts
  const [showAlert, setShowAlert] = useState(true);

  // Using the custom hook to make the API call
  const { data: trips, loading, error, fetchData } = useApi("api/trips");

  const handleTripsUpdate = (deletedTripId) => {
    fetchData(); // Refresh the trip list from the server after deletion
  };

  return (
    <section className="py-6 px-6">
      {/* Loading Message */}
      {loading && (
        <MessageAlert
          variant="info"
          message="Loading trips..."
          show={showAlert}
          setShow={setShowAlert}
        />
      )}

      {/* Error Message */}
      {error && (
        <MessageAlert
          variant="danger"
          message={`Error: ${error}`}
          show={showAlert}
          setShow={setShowAlert}
        />
      )}

      {/* Display Trip Items */}
      {!loading &&
        !error &&
        trips &&
        trips.length > 0 &&
        trips.map((trip) => (
          <PlanItem
            key={trip._id}
            id={trip._id}
            name={trip.name ? trip.name : `${trip.start_location} to ${trip.end_location}`}
            title={`${trip.start_location} to ${trip.end_location}`}
            type={trip.trip_interest}
            duration={trip.total_duration}
            itinerary={trip.itinerary}
            router={router}
            onDelete={handleTripsUpdate} // Pass the delete handler to PlanItem
            isClickable={true}
          />
        ))}

      {/* No Trips Message */}
      {!loading && !error && trips && trips.length === 0 && (
        <MessageAlert
          variant="info"
          message="No trips found."
          show={showAlert}
          setShow={setShowAlert}
        />
      )}
    </section>
  );
}
