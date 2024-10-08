'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useAuth = () => {
  const router = useRouter();

  useEffect(() => {
    // Get the user's token
    const token = localStorage.getItem('token');

    const validateToken = async () => {
      if (token) {
        try {
            console.log("Verifying Token");
          const response = await fetch('http://localhost:4000/api/firebase/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ token }),
          });

          if (!response.ok) {
            // Token is invalid
            throw new Error("Token invalid");
          } else {
            // Token is valid; redirect to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
        
          console.error('Error validating token:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('uuid');
        }
      } 
      // If no token, do nothing to stay on the homepage
    };

    validateToken();
  }, [router]);
};

export default useAuth;