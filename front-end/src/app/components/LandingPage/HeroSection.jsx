import React from 'react'

export default function HeroSection() {
  return (
    <section className="bg-white py-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
      {/* Text Section */}
      <div className="max-w-lg text-center md:text-left">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Road Trip Planning Buddy
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Clarity gives you the blocks & components you need to create a truly
          professional website, landing page, or admin panel for your SaaS.
        </p>
        <button className="bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 transition-colors">
          Plan Now
        </button>
      </div>

      {/* Image Placeholder */}
      <div className="mt-10 md:mt-0">
        <div className="w-80 h-80 bg-gray-200 border border-gray-300 flex items-center justify-center rounded-lg">
          <img
            src="https://via.placeholder.com/150"
            alt="Placeholder"
            className="h-32 w-32"
          />
        </div>
      </div>
    </div>
  </section>
  )
}
