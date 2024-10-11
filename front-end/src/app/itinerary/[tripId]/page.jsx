'use client';
import "../../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import TimelineView from "../../components/Itinerary/TimelineView";
import SearchBar from "../../components/Dashboard/SearchBar";
import Footer from "../../components/Footer";

export default function page() {
  return (
    <div>
      <SearchBar />
      <TimelineView />
      <Footer />
    </div>
  );
}
