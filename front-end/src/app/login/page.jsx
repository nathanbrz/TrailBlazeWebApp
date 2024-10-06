'use client';

import React, { useState } from 'react';
import '../../styles/global_styles.css';
import { doSignInUserWithEmailAndPassword  } from '../firebase/auth';
import { useRouter } from 'next/navigation';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Handling authentication through firebase
    try {
      const userCredential = await doSignInUserWithEmailAndPassword(email, password);
      console.log("User logged in!");

      // Get the user's token after successful login
      const token = await userCredential.user.getIdToken();

      // Send the token to the backend for verification
      const response = await fetch('http://localhost:4000/api/firebase/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the token to the backend
      });
 
       // Check for errors in the response
       if (!response.ok) {
         throw new Error("Failed to verify token");
       }
 
       // Get the response data
       const data = await response.json();
       console.log('Session established:', data);

      // Saving the token and userID in local storage
      localStorage.setItem('token', token)
      localStorage.setItem('uuid', data.uid);

      router.push('../dashboard');
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Sign in failed");
    }
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="card p-12 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;