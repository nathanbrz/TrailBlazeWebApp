"use client";

import React, { useState } from "react";
import "../../styles/global_styles.css";
import { doSignInUserWithEmailAndPassword } from "../firebase/auth";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  /**
   * Handles form submission for user login.
   * Attempts to sign in the user with Firebase using the entered email and password.
   * If successful, redirects to the dashboard. If failed, displays an error message.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Handling authentication through firebase
    try {
      const userCredential = await doSignInUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User logged in!");
      router.push("../dashboard");
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Sign in failed");
    }

    console.log("Login submitted:", { email, password });
  };
  
  const handdleSignUp = () => {
    router.push("/signup");
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "100vh" }}
    >
      <div
        className="card p-12 shadow-lg"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
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
            <label htmlFor="password" className="form-label">
              Password
            </label>
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
          {/* Display error message if sign-in fails */}
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors"
          >
            Log in
          </button>
        </form>
        <button
          type="submit"
          className="bg-zinc-200 my-2 text-black px-6 py-3 w-100 rounded-md hover:bg-zinc-400 transition-colors"
          onClick={handdleSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;
