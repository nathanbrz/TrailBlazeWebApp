"use client";

import React, { useState, useEffect } from "react";
import "../../../styles/global_styles.css";
import { doCreateUserWithEmailAndPassword } from "../../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import MessageAlert from "../../components/MessageAlert";
import Link from "next/link";
import GenericNav from "../../components/GenericNav";
import "bootstrap/dist/css/bootstrap.min.css";
import { useApi } from "../../hooks/useApi";

const Signup = () => {
  useAuth();

  const [first_name, setFirstName] = useState("");
  const [last_name, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Individual error messages for each field
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const router = useRouter();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsClient(true);
    }
  }, []);

  const { fetchData: createUser, error: createUserError } = useApi("api/users", "POST");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isClient) return;

    // Clear previous errors
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPasswordError("");

    // Input validation
    let hasError = false;

    if (!/^[a-zA-Z]+$/.test(first_name)) {
      setFirstNameError("First name should contain only letters.");
      hasError = true;
    }
    if (!/^[a-zA-Z]+$/.test(last_name)) {
      setLastNameError("Last name should contain only letters.");
      hasError = true;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("Please enter a valid email address.");
      hasError = true;
    }
    if (password.length < 6) {
      setPasswordError("Password should be at least 6 characters long.");
      hasError = true;
    }

    if (hasError) return; // Stop submission if there are validation errors

    try {
      const userCredential = await doCreateUserWithEmailAndPassword(email, password);
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid;

      localStorage.setItem("token", token);
      localStorage.setItem("uuid", userId);

      await createUser({
        body: { first_name, last_name },
        headers: { Authorization: `Bearer ${token}` },
      });

      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message || createUserError,
        variant: "danger",
      });
      console.error("Signup error:", error);
    }
  };

  return (
    <>
      <GenericNav profileMenu={false} />
      <div className="d-flex align-items-center justify-content-center" style={{ height: "100vh" }}>
        <div className="card p-12 shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
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
              {firstNameError && <p className="text-danger">{firstNameError}</p>}
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
              {lastNameError && <p className="text-danger">{lastNameError}</p>}
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
              {emailError && <p className="text-danger">{emailError}</p>}
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
              {passwordError && <p className="text-danger">{passwordError}</p>}
            </div>
            <button type="submit" className="btn-blaze text-white px-6 py-3 w-100 rounded-md hover:bg-red-700 transition-colors">
              Sign Up
            </button>
          </form>
          <p className="text-center mt-3">
            ... or proceed to <Link href="/login">log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;