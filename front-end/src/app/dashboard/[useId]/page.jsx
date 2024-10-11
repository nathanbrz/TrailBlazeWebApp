'use client';
import "../../../styles/global_styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchBar from "../../components/Dashboard/SearchBar";
import IntroSection from "../../components/Dashboard/IntroSection";
import PlanListSection from "../../components/Dashboard/PlanListSection";
import Footer from "../../components/Footer";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Hero() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(`http://localhost:${process.env.NEXT_PUBLIC_BACK_END_PORT}/api/firebase/session`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Token validation failed');
        }

        const userData = await response.json();
        setUser(userData); // Set the user data once the token is validated
      } catch (error) {
        console.error('Error validating token:', error);
        router.push('/login');
      }
    };
    validateToken();
  }, [router]);
  return (
    <div>
      <SearchBar />
      <div>
        <IntroSection />
      </div>
      <div>
        <PlanListSection router={router}/>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
