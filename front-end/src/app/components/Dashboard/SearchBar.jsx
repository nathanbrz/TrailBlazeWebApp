"use client";
import React, { useState } from "react";
import SearchForm from "./SearchForm";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { doSignOut } from "../../firebase/auth"; // Import sign out function
import { Dropdown } from "react-bootstrap";

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
          <div className="flex-shrink-0 flex items-center col-lg-8 col-6">
            <SearchForm />
          </div>
          <div className="relative">
            {/* Bootstrap Dropdown */}
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="link"
                bsPrefix="p-0"
                id="dropdown-basic"
              >
                <div className="p-2 rounded-full">
                  {" "}
                  {/* Add padding and optional background */}
                  <Image
                    src="/images/user-icon.png"
                    width="50"
                    height="50"
                    alt="profile image"
                    style={{ cursor: "pointer" }}
                  />
                </div>
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
      </div>
    </nav>
  );
}
