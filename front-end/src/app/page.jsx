
import React from 'react'
import Navbar from './components/LandingPage/Navbar'
import HeroSections from './components/LandingPage/HeroSection'
import FeaturesSection from './components/LandingPage/FeaturesSection';
import '../styles/global_styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Hero() {
  return (
    <div>
      <Navbar />
      <HeroSections />
      <FeaturesSection />
      {/* <AboutUsSection /> */}
    </div>
  )
}
