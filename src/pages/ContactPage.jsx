import React, { useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import ContactUs from "../components/ContactUs";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25 },
  },
};

const ContactPage = () => {

  // ⭐ Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">

      {/* NAVBAR */}
      <NavBar />

      {/* GLOW BACKGROUND */}
      <div className="absolute top-0 left-0 w-[450px] h-[450px] bg-purple-700 blur-[200px] opacity-20 rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-[450px] h-[450px] bg-blue-600 blur-[200px] opacity-20 rounded-full"></div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 pt-40 pb-20 px-6 md:px-16 max-w-7xl mx-auto">

        {/* PAGE HEADING */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="show"
          className="text-center mb-16"
        >
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-6xl font-extrabold leading-tight"
          >
            Connect With  
            <span className="text-purple-500"> TryNex</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="text-gray-400 mt-4 max-w-3xl mx-auto text-lg"
          >
            Have questions about AI try-ons, brand integrations, creator tools, or our virtual fashion tech?  
            Whether you're a shopper, a business, or a developer — our team is here to help.  
            Fill out the form below and we’ll get back to you shortly.
          </motion.p>
        </motion.div>

        {/* CONTACT FORM SECTION */}
        <ContactUs />
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default ContactPage;
