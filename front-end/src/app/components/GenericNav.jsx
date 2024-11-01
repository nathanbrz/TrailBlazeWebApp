"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doSignOut } from "../firebase/auth"; // Import sign out function

export default function SearchBar() {
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility
  const router = useRouter();
  const uid = localStorage.getItem("uuid");

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
        <div className="flex justify-content-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link
              href="/"
              style={{ cursor: "pointer" }}
              className="text-2xl font-bold text-blaze"
            >
              TrailBlaze
            </Link>
          </div>
          <div className="relative">
            {/* Profile Image */}
            <Image
              src="/images/user-icon.png"
              width="50"
              height="50"
              alt="profile image"
              onClick={() => setDropdownOpen(!dropdownOpen)} // Toggle dropdown on click
              style={{ cursor: "pointer" }}
            />

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
                <button
                  onClick={() => router.push(`/dashboard/${uid}`)}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleSettings}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Settings
                </button>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
