'use client';
import React from "react";
import PlanItem from "./PlanItem";
import { useEffect, useState } from "react";

export default function PlanListSection({router}) {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch(
          `http://localhost:${process.env.NEXT_PUBLIC_BACK_END_PORT}/api/trips`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trips");
        }
        const data = await response.json();
        setTrips(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return <div>Loading trips...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section className="py-6">
      {trips.map((trip) => (
        <PlanItem
          key={trip._id}
          id={trip._id}
          title={`${trip.start_location} to ${trip.end_location}`}
          type={trip.trip_interest}
          duration={trip.total_duration}
          router={router}
        />
      ))}
    </section>
  );
}
