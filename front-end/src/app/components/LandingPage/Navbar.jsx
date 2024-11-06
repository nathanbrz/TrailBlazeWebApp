"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  // Function to navigate to the login page
  const handlePlanNowClick = () => {
    router.push("/login"); // Navigates to /login
  };

  // Function to scroll to a specific section on the page
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop, // Scroll to the top of the section
        behavior: "smooth", // Smooth scrolling
      });
    }
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Scroll to the top of the page
      behavior: "smooth", // Smooth scrolling
    });
  };

  return (
    <nav className="bg-white shadow-md fixed-top">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span
              onClick={scrollToTop}
              className="text-2xl font-bold text-blaze"
              style={{ cursor: "pointer" }}
            >
              TrailBlaze
            </span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a
              onClick={() => scrollToSection("features")}
              className="text-gray-700 hover:text-gray-900 text-decoration-none cursor-pointer"
            >
              Features
            </a>
            <a
              onClick={() => scrollToSection("about")}
              className="text-gray-700 hover:text-gray-900 text-decoration-none cursor-pointer"
            >
              About Us
            </a>
            <button
              className="btn-blaze text-white px-4 py-2 rounded hover:bg-red-700"
              onClick={handlePlanNowClick}
            >
              Plan Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
