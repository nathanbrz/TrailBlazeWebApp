"use client";
import React from 'react';
import "../../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../../components/Dashboard/SearchBar";
import IntroSection from "../../components/Dashboard/IntroSection";
import PlanListSection from "../../components/Dashboard/PlanListSection";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApi } from "../../hooks/useApi";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState(null); // State to store user information
  const [firebaseUID, setFirebaseUID] = useState(null); // State to store Firebase UID
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
  }); // State to manage alerts

  // Fetch user data only if firebaseUID is set
  const { data, error } = useApi(firebaseUID ? `api/users/${firebaseUID}` : null, "GET");

  const [loading, setLoading] = useState(true);

  // Environment variables for backend URL and port
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || 'http://localhost';
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || '4000';

  // Effect to retrieve Firebase UID from localStorage
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const uid = localStorage.getItem("uuid");
      if (uid) {
        setFirebaseUID(uid);
      } else {
        router.push("/login"); // Redirect to login if UID not found
        setAlert({
          show: true,
          message: "No firebaseUID found", // Set alert message
          variant: "danger",
        });
      }
    }
  }, [router]);


  // Check for error from useApi and set the alert accordingly
  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data && data.user) {
      setUser(data.user);
    }
    setLoading(false);
  }, [data, error]);

  // While loading, display a loading spinner or placeholder
  if (loading) {
    return <div>Loading...</div>;  // You can replace this with a more elegant spinner or loading component
  }

  return (
    <div>
      <div className="page-container">
        <div className="content">
          <SearchBar />
          <div>
            <IntroSection user={user} />
          </div>
          <div>
            <PlanListSection router={router} />
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}