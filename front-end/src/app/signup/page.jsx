"use client";

import React, { useState } from "react";
import "../../styles/global_styles.css";
import { doCreateUserWithEmailAndPassword } from "../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";
import { useApi } from "../hooks/useApi"; // Import the useApi hook
import MessageAlert from "../components/MessageAlert"; // Import the MessageAlert component

const Signup = () => {
  // Checks if user is already logged in
  useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Handling authentication through Firebase
      const userCredential = await doCreateUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User signed up!");

      // Getting the user's token and uid after successful signup
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid; // Get the userId (uid)

      // Send the token to the backend for verification
      await verifyToken({ body: { token } });

      // Check for token verification errors
      if (verifyTokenError) {
        throw new Error(
          `Token verification failed: ${verifyTokenError} (Status: ${verifyTokenStatus})`
        );
      }

      // Save the user in the database
      await createUser({
        body: { first_name, last_name },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Saving the token and userID in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("uuid", userId);

      // Dynamically navigate to the user-specific dashboard using the userId
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message,
        variant: "danger",
      });
      console.log(error);
    }

    console.log("Signup submitted:", {
      email,
      password,
      first_name,
      last_name,
    });
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
        <h2 className="text-center mb-4">Sign Up</h2>

        {alert.show && (
          <MessageAlert
            variant={alert.variant}
            message={alert.message}
            show={alert.show}
            setShow={(value) => setAlert({ ...alert, show: value })}
          />
        )}

        <form onSubmit={handleSubmit}>
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
      </div>
    </div>
  );
};

export default Signup;
