"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { doSignOut } from "../firebase/auth"; // Import sign out function

export default function SearchBar({ profileMenu = true }) {
  const router = useRouter();
  const uid = localStorage.getItem("uuid");

  const handleLogoClick = () => {
    if (uid) {
      // If user is logged in, navigate to the dashboard
      router.push(`/dashboard/${uid}`);
    } else {
      // If user is not logged in, navigate to the home page
      router.push("/");
    }
  };

  const handleSettings = () => {
    router.push(`/settings/${uid}`); // Redirect to settings page with user ID
  };

  const handleLogout = async () => {
    try {
      await doSignOut(); // Call Firebase sign out
      // Clear the user token from localStorage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("uuid");
      router.push("/login"); // Redirect to login page
    } catch (error) {
      console.error("Failed to log out:", error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <span
              onClick={handleLogoClick}
              className="text-2xl font-bold text-blaze"
              style={{ cursor: "pointer" }}
            >
              TrailBlaze
            </span>
          </div>

          {/* Bootstrap Dropdown */}
          {profileMenu && (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                bsPrefix="p-0"
                id="dropdown-basic"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="#333333"
                  viewBox="0 0 24 24"
                  style={{ cursor: "pointer" }}
                  alt="menu icon"
                >
                  <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
                </svg>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  className="custom-dropdown-item"
                  onClick={() => router.push(`/dashboard/${uid}`)}
                >
                  Dashboard
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item"
                  onClick={handleSettings}
                >
                  Settings
                </Dropdown.Item>
                <Dropdown.Item
                  className="custom-dropdown-item"
                  onClick={handleLogout}
                >
                  Log Out
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>
    </nav>
  );
}
