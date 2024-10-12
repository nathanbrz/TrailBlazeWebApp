'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || 'http://localhost';
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || '4000'


  useEffect(() => {
    // Get the user's token from localStorage
    const token = localStorage.getItem('token');

    const validateToken = async () => {
      if (token) {
        try {
          console.log("Verifying token...");
          const response = await fetch(`${URL}:${PORT}/api/firebase/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error("Token invalid");
          }

          // Redirect to dashboard if the user is on login/signup and is authenticated
          if (router.pathname === '/login' || router.pathname === '/signup') {
            console.log("User authenticated, redirecting to dashboard...");
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
        }
      } else {
        console.log("No token found, staying on the current page.");
      }
    };

    validateToken();
  }, [router]);
};

export default useAuth;