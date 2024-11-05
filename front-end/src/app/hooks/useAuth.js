'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../firebase/config.js'
import { onIdTokenChanged } from 'firebase/auth';

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

        console.log("Now here");
        console.log("No token found, staying on the current page.");
      }
    };
    
    // Inital token check
    validateToken();


    /*
    * Firebase automatically refreshes tokens every hour
    * This is an observer to be called when the token is refreshed
    * If the user is logged in
      * Gets the new token
      * Stores it in the local storage
      * Validates the token to ensure it is correct
    * If the user is not logged in the token is removed and user sent back to login screen
    */
    /*
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        // User is signed in
        const newToken = await user.getIdToken();
        localStorage.setItem("token", String(newToken));
        //validateToken(newToken);
      } else {
        // Remove token when user is signed out
        localStorage.removeItem("token");
      }
    });

    // Remove listener when effect is unmounted
    return () => unsubscribe();
    */
    
  }, [router]); // Dependency array to re-run effect if router changes
};

export default useAuth;