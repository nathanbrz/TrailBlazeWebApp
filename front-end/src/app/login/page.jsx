"use client";
import React, { useState } from "react";
import "../../styles/global_styles.css";
import { doSignInUserWithEmailAndPassword } from "../../firebase/auth";
import { useRouter } from "next/navigation";
import useAuth from "../../hooks/useAuth";
import { useApi } from "../../hooks/useApi";
import MessageAlert from "../../components/MessageAlert";

const Login = () => {
  // Checks if user is already logged in
  useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const router = useRouter();

  // useApi hook for POST request to verify the user's token
  const {
    loading,
    error,
    responseStatus,
    fetchData: verifyToken,
  } = useApi("api/firebase/session", "POST");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase authentication
      const userCredential = await doSignInUserWithEmailAndPassword(
        email,
        password
      );
      console.log("User logged in!");

      // Get the user's token and uid after successful login
      const token = await userCredential.user.getIdToken();
      const userId = userCredential.user.uid; // Get the userId (uid)

      // Trigger the API request to verify the token
      await verifyToken({ body: { token } });

      // Check for errors after attempting to verify token
      if (error) {
        throw new Error(
          `Token verification failed: ${error} (Status: ${responseStatus})`
        );
      }

      // If verification is successful, save token and userId to local storage
      console.log("Session established:", { token, userId });
      localStorage.setItem("token", String(token));
      localStorage.setItem("uuid", userId);

      // Dynamically navigate to the user-specific dashboard using the userId
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setAlert({
        show: true,
        message: error.message,
        variant: "danger",
      });
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button
          type="button"
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
