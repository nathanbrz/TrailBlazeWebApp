"use client";
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
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    variant: "",
  });

  const firebaseUID = localStorage.getItem("uuid");

  // Fetch user data using useApi hook
  const { data, loading, error } = useApi(`api/users/${firebaseUID}`, "GET");

  useEffect(() => {
    if (!firebaseUID) {
      router.push("/login");
      setAlert({
        show: true,
        message: "No firebaseUID found",
        variant: "danger",
      });
    }
  }, [firebaseUID, router]);

  // Check for error from useApi and set the alert accordingly
  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data && data.user) {
      setUser(data.user);
    }
  }, [data, error]);

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
