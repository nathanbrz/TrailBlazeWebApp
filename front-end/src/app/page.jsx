
import React from 'react'
import Navbar from './components/LandingPage/Navbar'
import HeroSections from './components/LandingPage/HeroSection'
import '../styles/global_styles.css';

export default function Hero() {
  return (
    <div>
      <Navbar />
      <HeroSections />
      {/* <FeaturesSection />
      <AboutUsSection /> */}
    </div>
  )
}
