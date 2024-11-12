"use client";
import React from "react";
import { useRouter } from "next/navigation";

// Import photo
import landingPage_Hero from "../../../../public/images/landingPage/hero/hero.png";

export default function HeroSection() {
  const router = useRouter();

  // Function to handle "Plan Now" button click
  const handlePlanNowClick = () => {
    router.push('/login'); // Navigates to /login
  };

  return (
    <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      {/* Text Section */}
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Road Trip Planning Buddy
        </h1>
        <p className="text-lg text-gray-700 mb-6">
        Intelligent road trip planner that helps you effortlessly create and manage personalized travel itineraries, 
        offering tailored recommendations and valuable insights to make every journey unforgettable.
        </p>
        <button className="btn-blaze text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors cursor-pointer" onClick={handlePlanNowClick}>
          Plan Now
        </button>
      </div>

      {/* Image Placeholder */}
      <div className="mt-10 md:mt-0">
        {/*<div className="w-80 h-80 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-lg"> */}
          <img
            //src="https://via.placeholder.com/150"
            src={landingPage_Hero.src}
            alt="Placeholder"
            className="w-80 h-80 rounded-lg object-cover"
            //className="h-32 w-32"
          />
        </div>
    </div>
  </section>
  )
}
