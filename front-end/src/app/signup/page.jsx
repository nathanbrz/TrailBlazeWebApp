'use client';

import React, { useState } from 'react';
import '../../styles/global_styles.css';
import { doCreateUserWithEmailAndPassword, doSignUpUserWithEmailAndPassword } from '../firebase/auth'; 
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [name, setName] = useState('')
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

      // Getting the users token
      const token = await userCredential.user.getIdToken();

      // Send the token to backend for verification
      const response = await fetch('http://localhost:4000/api/firebase/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }), // Send the token to the backend
      });

      // ERROR
      if (!response.ok) {
        throw new Error("Failed to verify token")
      }

      // Verified user
      const data = await response.json();
      console.log('Session established:', data);

      // Saving the token and userID in local storage
      localStorage.setItem('token', token)
      localStorage.setItem('uuid', data.uid);

      // Go to dashboard page
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Sign up failed");
    }
    console.log('Signup submitted:', { email, password });
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
      <div className="card p-12 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Sign Up</h2>
        {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display  message */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
            <input
              type="name"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
