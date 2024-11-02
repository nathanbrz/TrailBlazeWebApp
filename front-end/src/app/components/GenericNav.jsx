"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dropdown } from "react-bootstrap";
import { doSignOut } from "../firebase/auth"; // Import sign out function

export default function SearchBar() {
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
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold text-blaze"
              style={{ cursor: "pointer" }}
            >
              TrailBlaze
            </Link>
          </div>

          {/* Bootstrap Dropdown */}
          <Dropdown align="end">
            <Dropdown.Toggle variant="link" bsPrefix="p-0" id="dropdown-basic">
              <Image
                src="/images/user-icon.png"
                width="50"
                height="50"
                alt="profile image"
                style={{ cursor: "pointer" }}
              />
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
        </div>
      </div>
    </nav>
  );
}