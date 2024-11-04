"use client";

import React, { useState } from "react";
import "../../styles/global_styles.css";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { useApi } from "../hooks/useApi";
import MessageAlert from "../components/MessageAlert";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import GenericNav from "../components/GenericNav";

const Signup = () => {
  // Checks if user is already logged in
  useAuth();

  // State variables for form inputs
  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const router = useRouter();

  // useApi hooks for POST requests
  const {
    fetchData: verifyToken,
    error: verifyTokenError,
    responseStatus: verifyTokenStatus,
  } = useApi("api/firebase/session", "POST");

  const { fetchData: createUser, error: createUserError } = useApi(
    "api/users",
    "POST"
  );

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior to handle it with JavaScript

    let errorMessages = [];

    // Input validation
    if (!/^[a-zA-Z]+$/.test(first_name)) {
      errorMessages.push("First name should contain only letters.");
    }
    if (!/^[a-zA-Z]+$/.test(last_name)) {
      errorMessages.push("Last name should contain only letters.");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMessages.push("Please enter a valid email address.");
    }
    if (password.length < 6) {
      errorMessages.push("Password should be at least 6 characters long.");
    }

    if (errorMessages.length > 0) {
      setAlert({
        show: true,
        message: (
          <ul style={{ paddingLeft: "20px" }}>
            {errorMessages.map((msg, index) => (
              <li key={index} style={{ listStyleType: "disc" }}>
                {msg}
              </li>
            ))}
          </ul>
        ),
        variant: "danger",
      });
      return;
    }

    try {
      // Step 1: Use Firebase's sign-up function to create a new user with email and password.
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User signed up:", userCredential);

      // Step 2: Retrieve the ID token and UID for the newly signed-up user.
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;
      console.log("Token and UID received:", { token, userId });

      // Step 3: Verify the token by sending it to the backend for validation.
      await verifyToken({ body: { token } });

      // Step 4: Check if there was an error during token verification.
      if (verifyTokenError) {
        // If there's an error with the verification, throw an error with details
        throw new Error(
          `Token verification failed: ${verifyTokenError} (Status: ${verifyTokenStatus})`
        );
      }
      console.log("Token verified successfully.");

      // Step 5: Create a new user in the backend database, including the first name and last name.
      await createUser({
        body: { first_name, last_name },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("User created in the backend.");

      // Step 6: Store the token and UID in local storage for session persistence.
      localStorage.setItem("token", token);
      localStorage.setItem("uuid", userId);
      console.log("Stored token and uuid in localStorage");

      // Step 7: Redirect the user to their dashboard, using their unique UID for dynamic navigation.
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      // If any errors occur in the process, display an alert with the error message.
      setAlert({
        show: true,
        message: error.message,
        variant: "danger",
      });
      console.error("Signup error:", error); // Log the error for debugging
    }

    // Log the signup data to confirm the values at submission
    console.log("Signup submitted:", {
      email,
      password,
      first_name,
      last_name,
    });
  };

  return (
    <>
      <GenericNav profileMenu={false} />
      <div
        className="d-flex align-items-center justify-content-center"
        style={{ height: "100vh" }}
      >
        <div
          className="card p-12 shadow-lg"
          style={{ width: "100%", maxWidth: "400px" }}
        >
          <h2 className="text-center mb-4">Sign Up</h2>

          {alert.show && (
            <MessageAlert
              variant={alert.variant}
              message={alert.message}
              show={alert.show}
              setShow={(value) => setAlert({ ...alert, show: value })}
            />
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">
                First Name
              </label>
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
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
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
            <button
              type="submit"
              className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors"
            >
              Sign Up
            </button>
          </form>
          {/* Link to Login */}
          <p className="text-center mt-3">
            ... or proceed to <Link href="/login">log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
