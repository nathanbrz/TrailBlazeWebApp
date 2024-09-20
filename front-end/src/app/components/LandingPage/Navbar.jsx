import React from "react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-bold text-red-600">TrailBlaze</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#features" className="text-gray-700 hover:text-gray-900 text-decoration-none">Features</a>
            <a href="#about" className="text-gray-700 hover:text-gray-900 text-decoration-none">About Us</a>
            <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Plan Now</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
