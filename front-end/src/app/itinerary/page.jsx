// src/pages/itinerary.js
"use client";
import "../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import TimelineView from "../components/Itinerary/TimelineView";
import GenericNav from "../components/GenericNav";
import Footer from "../components/Footer";
import { useSearchParams } from "next/navigation";
import withAuth from "../components/withAuth"; // Import the HOC
import { Suspense } from "react";

function ItineraryPage() {
  const searchParams = useSearchParams(); // Hook to retrieve query parameters
  const encodedData = searchParams.get("itinerary"); // Get the "itinerary" parameter
  const itinerary = encodedData
    ? JSON.parse(decodeURIComponent(encodedData)) // Decode and parse the itinerary data
    : {};

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <div className="page-container">
          <div className="content">
            <GenericNav />
            <TimelineView itinerary={itinerary} />
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
}

export default withAuth(ItineraryPage); // Wrap the page with withAuth HOC to protect the route
