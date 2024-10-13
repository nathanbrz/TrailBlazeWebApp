"use client";
import "../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import TimelineView from "../components/Itinerary/TimelineView";
import SearchBar from "../components/Dashboard/SearchBar";
import Footer from "../components/Footer";
import { useSearchParams } from "next/navigation";

export default function page() {
  const searchParams = useSearchParams();
  const encodedData = searchParams.get("itinerary");
  const itinerary = encodedData
    ? JSON.parse(decodeURIComponent(encodedData))
    : {};
  return (
    <div>
      <div className="page-container">
        <div className="content">
          <SearchBar />
          <TimelineView itinerary={itinerary} />
        </div>
        <Footer />
      </div>
    </div>
  );
}
