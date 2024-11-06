// src/pages/itinerary.js
"use client";
import "../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import TimelineView from "../components/Itinerary/TimelineView";
import GenericNav from "../components/GenericNav";
import Footer from "../components/Footer";
import { useSearchParams, useRouter  } from "next/navigation";
import withAuth from "../components/withAuth"; // Import the HOC
import { Suspense } from "react";
import "bootstrap-icons/font/bootstrap-icons.css"; // Import Bootstrap Icons

function ItineraryPage() {
  const searchParams = useSearchParams(); // Hook to retrieve query parameters
  const router = useRouter(); // Initialize router here
  const uid = localStorage.getItem("uuid");

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
            <button
              onClick={() => router.push(`/dashboard/${uid}`)}
              className="btn-blaze text-white m-6 px-3 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
            >
              <i className="bi bi-arrow-left me-2"></i>{" "}
              {/* Bootstrap Icon for Back Arrow */}
              Dashboard
            </button>
            <TimelineView itinerary={itinerary} />
          </div>
          <Footer />
        </div>
      </div>
    </Suspense>
  );
}

export default withAuth(ItineraryPage); // Wrap the page with withAuth HOC to protect the route
