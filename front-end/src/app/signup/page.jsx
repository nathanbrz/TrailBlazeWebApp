'use client';

import React, { useState } from 'react';
import '../../styles/global_styles.css';
import { doCreateUserWithEmailAndPassword } from '../firebase/auth'; 
import { useRouter } from 'next/navigation';
import useAuth from '../hooks/useAuth'; 

const Signup = () => {

  // Checks if user is already logged in
  useAuth();

  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handling authentication through firebase
    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      console.log("User signed up!");

      // Getting the user's token
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid; // Get the userId (uid)

      // Send the token and user info to the backend for verification and storing first and last name
      const response = await fetch(`http://localhost:4000/api/firebase/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ token, first_name, last_name }), // Send the token and user info to the backend
      });

      if (!response.ok) {
        throw new Error("Failed to verify token");
      }

      const data = await response.json();
      console.log('Session established:', data);

      // Saving the token and userID in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('uuid', userId);

      // Dynamically navigate to the user-specific dashboard using the userId
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Sign up failed");
    }

    console.log('Signup submitted:', { email, password, firstName, lastName });
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="card p-12 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display  message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="firstName" className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              id="firstName"
              placeholder="Enter your first name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="lastName" className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              id="lastName"
              placeholder="Enter your last name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;