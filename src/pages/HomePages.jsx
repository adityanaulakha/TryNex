"use client";
import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';
import HeroSection from '../components/HeroSection';
import KeyFeatures from '../components/KeyFeatures';
import HowItWorks from '../components/HowItWorks';
import AnimatedOutlineMarquee from '../components/AnimatedOutlineMarquee';
import FAQSection from '../components/FAQSection';
import PricingSection from '../components/PricingSection';
import Footer from '../components/Footer';
import PreFooterCTA from '../components/PreFooterCTA';
import DomeGallery from '../components/DomeGallery';

const HomePages = () => {

  // ⭐ Scroll to top when Home Page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative bg-black overflow-hidden">

      {/* 🔥 Page Content */}
      <NavBar />
      <HeroSection />
      <KeyFeatures />

      <div className="w-full h-[600px] md:h-[800px] mt-20 flex flex-col items-center">
        <h2 className='text-white text-[42px] font-bold mb-12'>Featured Gallery</h2>
        <DomeGallery />
      </div>

      <HowItWorks />
      <AnimatedOutlineMarquee />
      <FAQSection />
      <PricingSection />
      <PreFooterCTA />
      <Footer />

    </div>
  );
};

export default HomePages;
