"use client";

import React, { useState, useEffect } from "react";
import "../../../styles/global_styles.css";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import MessageAlert from "../../components/MessageAlert";
import Link from "next/link";
import GenericNav from "../../components/GenericNav";
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
  // Checks if user is already logged in
  useAuth();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const router = useRouter();

  // State variable to indicate if the code is running in the browser
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This will only run on the client side
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isClient) return; // Ensure this code only runs in the browser

    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      // Safely store data in localStorage on the client side
      if (isClient) {
        localStorage.setItem("token", token);
        localStorage.setItem("uuid", userId);
      }

      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setAlert({ show: true, message: error.message, variant: "danger" });
    }
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
