
'use client'
import React from 'react'
import Navbar from './components/LandingPage/Navbar'
import HeroSections from './components/LandingPage/HeroSection'
import FeaturesSection from './components/LandingPage/FeaturesSection';
import AboutUsSection from './components/LandingPage/AboutUsSection';
import Footer from './components/Footer';
import '../styles/global_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import useAuth from './hooks/useAuth'; 
export default function Hero() {
  
  // Checks if user is already logged in
  useAuth();

  return (
    <div>
      <Navbar />
      <div id="hero">
        <HeroSections />
      </div>
      <div id="features">
        <FeaturesSection />
      </div>
      <div id="about">
        <AboutUsSection />
      </div>
      <Footer />
    </div>
  )
}
