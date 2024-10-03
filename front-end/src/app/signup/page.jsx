'use client';

import React, { useState } from 'react';
import '../../styles/global_styles.css';
import { doCreateUserWithEmailAndPassword, doSignUpUserWithEmailAndPassword } from '../firebase/auth'; 
import { useRouter } from 'next/navigation';

const Signup = () => {
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
        {errorMessage && <p className="text-danger">{errorMessage}</p>} {/* Display error message */}
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
          <button type="submit" className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
