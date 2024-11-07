"use client";
import React, { useEffect, useState } from "react";
import GenericNav from "@/app/components/GenericNav";
import Footer from "@/app/components/Footer";
import withAuth from "@/app/components/withAuth";
import {
  doPasswordChange,
  doDeleteUser,
  doSignOut,
  doUpdateEmail,
  doUpdateName,
} from "@/app/firebase/auth";
import MessageAlert from "@/app/components/MessageAlert";
import { useRouter } from "next/navigation";
import { useApi } from "@/app/hooks/useApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../styles/global_styles.css";

function UserSettings() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });
  const [firebaseUID, setFirebaseUID] = useState(null);

  const router = useRouter();

  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);

  // fetch user data
  const { data, error } = useApi(
    firebaseUID ? `api/users/${firebaseUID}` : null,
    "GET"
  );
  // useApi hook for updating the user's name
  const {
    loading: updatingName,
    error: updateNameError,
    fetchData: updateName,
  } = useApi("api/users/names", "PUT");

  // useApi hook for updating the user's email
  const {
    loading: updatingEmail,
    error: updateEmailError,
    fetchData: updateEmail,
  } = useApi("api/users/email", "PUT");

  // Effect to retrieve Firebase UID from localStorage
  /*
  useEffect(() => {
    // Only access localStorage on the client side
    if (typeof window !== "undefined") {
      const uid = localStorage.getItem("uuid");
      if (uid) {
        setFirebaseUID(uid);
      } else {
        router.push("/login"); // Redirect to login if UID not found
        setAlert({
          show: true,
          message: "No firebaseUID found", // Set alert message
          variant: "danger",
        });
      }
    }
  }, [router]);
  */

  // Set the default input values
  // Check for error from useApi and set the alert accordingly
  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
    } else if (data && data.user) {
      setFirstName(data.user.first_name);
      setLastName(data.user.last_name);
      setEmail(data.user.email);
    }
  }, [data, error]);

  const validateName = () => {
    if (!firstName || firstName.length < 2) {
      setAlert({
        show: true,
        message: "First name must be at least 2 characters.",
        variant: "danger",
      });
      return false;
    }
    if (!lastName || lastName.length < 2) {
      setAlert({
        show: true,
        message: "Last name must be at least 2 characters.",
        variant: "danger",
      });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (!password || password.length < 6) {
      setAlert({
        show: true,
        message: "Password must be at least 6 characters.",
        variant: "danger",
      });
      return false;
    }
    return true;
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
      setAlert({
        show: true,
        message: "Please enter a valid email address.",
        variant: "danger",
      });
      return false;
    }
    return true;
  };

  const handleNameChangeSubmission = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Ensure the name is valid before proceeding
    if (!validateName()) return;

    try {
      // Call the API endpoint to update the name
      await updateName({
        body: { first_name: firstName, last_name: lastName },
      });

      // Check for API errors and display error alert if present
      if (updateNameError) {
        setAlert({
          show: true,
          message: updateNameError,
          variant: "danger",
        });
        return;
      }

      // Update display name on firebase as well
      await doUpdateName(firstName);

      // Show success alert if both updates are successful
      setAlert({
        show: true,
        message: "Name change successful.",
        variant: "success",
      });
    } catch (error) {
      // Handle errors from either API call and display error alert
      setAlert({
        show: true,
        message: error.message,
        variant: "danger",
      });
    }
  };

  const handlePasswordChangeSubmission = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (validatePassword()) {
      doPasswordChange(password)
        .then(() => {
          setAlert({
            show: true,
            message: "Password change successful.",
            variant: "success",
          });
        })
        .catch((error) => {
          setAlert({ show: true, message: error.message, variant: "danger" });
        });
    }
  };

  const handleEmailChangeSubmission = async (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Ensure the email is valid before proceeding
    if (!validateEmail()) return;

    try {
      // Call the API endpoint to update the email
      await updateEmail({
        body: { email },
      });

      // Check for API errors and display error alert if present
      if (updateEmailError) {
        setAlert({
          show: true,
          message: updateEmailError,
          variant: "danger",
        });
        return;
      }

      // Update email on Firebase or other systems as well
      await doUpdateEmail(email);

      // Show success alert if both updates are successful
      setAlert({
        show: true,
        message: "Email change successful.",
        variant: "success",
      });
    } catch (error) {
      // Handle any errors and display an error alert
      setAlert({
        show: true,
        message: error.message,
        variant: "danger",
      });
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    doDeleteUser()
      .then(() => {
        setAlert({
          show: true,
          message: "Goodbye!",
          variant: "success",
        });
        handleLogout();
      })
      .catch((error) => {
        setAlert({ show: true, message: error.message, variant: "danger" });
      });
  };

  const handleLogout = async () => {
    try {
      await doSignOut();
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error.message);
    }
  };

  return (
    <>
      <GenericNav />
      <div className="container mx-auto mt-10 p-5">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          User Settings
        </h2>
        {alert.show && (
          <MessageAlert
            variant={alert.variant}
            message={alert.message}
            show={alert.show}
            setShow={(value) => setAlert({ ...alert, show: value })}
          />
        )}

        {/* Name Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Name
          </h3>

          {/* First Name Field */}
          <div className="form-group mb-4">
            <label
              htmlFor="firstName"
              className="block text-gray-600 font-medium mb-2"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={firstName}
              onChange={handleFirstNameChange}
            />
          </div>

          {/* Last Name Field */}
          <div className="form-group mb-4">
            <label
              htmlFor="lastName"
              className="block text-gray-600 font-medium mb-2"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={lastName}
              onChange={handleLastNameChange}
            />
          </div>
          <button
            type="button"
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
            onClick={handleNameChangeSubmission}
          >
            Save Name
          </button>
        </div>

        {/* Password Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Password
          </h3>
          <div className="form-group">
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium mb-2"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            type="button"
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
            onClick={handlePasswordChangeSubmission}
          >
            Save Password
          </button>
        </div>

        {/* Email Section */}
        <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Change Email
          </h3>
          <div className="form-group">
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <button
            type="button"
            onClick={handleEmailChangeSubmission}
            className="mt-4 btn-blaze hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Save Email
          </button>
        </div>

        {/* Delete Account Section */}
        <div className="bg-red-100 shadow-lg rounded-lg p-8">
          <h3 className="text-xl font-semibold text-red-700 mb-4">
            Danger Zone
          </h3>
          <p className="text-gray-700 mb-4">
            Permanently delete your account. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded focus:outline-none"
          >
            Delete Account
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export { UserSettings as PureUserSettings };
export default withAuth(UserSettings);
