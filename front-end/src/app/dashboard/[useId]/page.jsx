"use client";
import "../../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../../components/Dashboard/SearchBar";
import IntroSection from "../../components/Dashboard/IntroSection";
import PlanListSection from "../../components/Dashboard/PlanListSection";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || 'http://localhost';
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || '4000'


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const firebaseUID = localStorage.getItem("uuid"); // Retrieve firebaseUID

        if (!firebaseUID) {
          router.push("/login");

          throw new Error("No firebaseUID found");
        }

        const response = await fetch(
          `${URL}:${PORT}/api/users/${firebaseUID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.json();
        setUser(userData.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);
  console.log(user);
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
