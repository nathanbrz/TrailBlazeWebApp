'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();
  const URL = process.env.NEXT_PUBLIC_BACK_END_URL || 'http://localhost'; // Base URL for the backend
  const PORT = process.env.NEXT_PUBLIC_BACK_END_PORT || '4000' // Port for the backend in development


  useEffect(() => {
    // Get the user's token from localStorage
    const token = localStorage.getItem('token');

    const validateToken = async () => {
      if (token) {
        try {
          // Send request to validate the token
          console.log("Verifying token...");
          const response = await fetch(`${URL}:${PORT}/api/firebase/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Include token in Authorization header
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            throw new Error("Token invalid"); // Handle invalid token
          }

          // Redirect to dashboard if the user is on login/signup and is authenticated
          if (router.pathname === '/login' || router.pathname === '/signup') {
            console.log("User authenticated, redirecting to dashboard...");
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token'); // Remove token if validation fails
        }
      } else {
        console.log("No token found, staying on the current page.");
      }
    };

    validateToken(); // Validate token on component mount
  }, [router]); // Dependency array to re-run effect if router changes
};

export default useAuth;