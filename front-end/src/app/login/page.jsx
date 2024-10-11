"use client";
import React, { useState } from "react";
import "../../styles/global_styles.css";
import { doSignInUserWithEmailAndPassword } from "../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

const Login = () => {
  // Checks if user is already logged in
  useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase authentication
      const userCredential = await doSignInUserWithEmailAndPassword(email, password);
      console.log("User logged in!");

      // Get the user's token and uid after successful login
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid; // Get the userId (uid)

      // Send the token to the backend for verification
      const response = await fetch(
        `http://localhost:${process.env.NEXT_PUBLIC_BACK_END_PORT}/api/firebase/session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify token");
      }

      // If verification is successful, save token and userId to local storage
      const data = await response.json();
      console.log("Session established:", data);

      localStorage.setItem("token", String(token));
      localStorage.setItem("uuid", userId);

      // Dynamically navigate to the user-specific dashboard using the userId
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setErrorMessage(error.message);
      console.log("Login failed:", error);
    }

    console.log("Login submitted:", { email, password });
  };

  const handleSignUp = () => {
    router.push("/signup");
  };

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
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors"
          >
            Login
          </button>
        </form>
        <button
          type="submit"
          className="bg-zinc-200 my-2 text-black px-6 py-3 w-100 rounded-md hover:bg-zinc-400 transition-colors"
          onClick={handleSignUp}
        >
          Sign up
        </button>
      </div>
    </div>
  );
};

export default Login;