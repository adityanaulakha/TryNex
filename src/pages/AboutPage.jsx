import React from "react";
import { motion } from "framer-motion";
import { Users, Target, Rocket, Sparkles, Shield, Zap, Cpu } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import MeetOurRockstars from "../components/MeetOurRockstars";

// Animations
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
};

const AboutPage = () => {
  return (
    <div className="w-full bg-black text-white min-h-screen overflow-hidden">
      <NavBar />

      {/* -------------------------------------- */}
      {/* 🔵 HERO SECTION */}
      {/* -------------------------------------- */}
      <section className="pt-40 pb-24 px-6 text-center relative">
        {/* Background Glow */}
        <div className="absolute top-10 left-0 w-[400px] h-[400px] bg-purple-700 blur-[180px] opacity-20"></div>
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-blue-600 blur-[200px] opacity-20"></div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="text-4xl md:text-6xl font-extrabold leading-tight"
        >
          Building the Future of  
          <span className="text-blue-500"> AI Fashion Technology</span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.25 }}
          className="text-gray-400 max-w-2xl mx-auto mt-5 text-lg"
        >
          TryNex is merging deep learning, virtual dressing tech and 
          computer vision to revolutionize how people shop online.
        </motion.p>
      </section>

      {/* -------------------------------------- */}
      {/* 🚀 STARTUP JOURNEY SECTION */}
      {/* -------------------------------------- */}
      <motion.section
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-6xl mx-auto px-6 mt-10"
      >
        <div className="bg-[#0f0f0f] border border-gray-700 p-10 rounded-2xl shadow-xl">
          <div className="flex items-center gap-3">
            <Rocket className="text-blue-500 w-10 h-10" />
            <h2 className="text-3xl font-bold">Our Startup Journey</h2>
          </div>

          <p className="text-gray-400 mt-6 leading-relaxed text-lg">
            TryNex was founded with one goal in mind — removing fashion guesswork 
            and empowering shoppers with **realistic AI try-ons** from any device, anywhere.
          </p>

          <p className="text-gray-400 mt-4 leading-relaxed text-lg">
            With a blend of machine learning, high-fidelity rendering and product-focused design, 
            we are shaping the most accurate try-on experience the world has ever seen.
          </p>

          {/* Mission / Vision */}
          <div className="grid sm:grid-cols-2 gap-6 mt-10">
            <div className="p-6 rounded-xl bg-black border border-gray-700 hover:border-blue-500 shadow-md transition">
              <Target className="text-blue-500 w-8 h-8" />
              <h3 className="text-xl font-semibold mt-3">Our Mission</h3>
              <p className="text-gray-400 mt-2">
                To make online shopping confident, efficient and immersive 
                through AI-powered personalization.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-black border border-gray-700 hover:border-blue-500 shadow-md transition">
              <Sparkles className="text-blue-500 w-8 h-8" />
              <h3 className="text-xl font-semibold mt-3">Our Vision</h3>
              <p className="text-gray-400 mt-2">
                To become the world’s most intelligent fashion assistant—trusted by 
                brands, creators and millions of daily users.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* -------------------------------------- */}
      {/* ⚡ WHY CHOOSE TRYNEX */}
      {/* -------------------------------------- */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className="max-w-6xl mx-auto px-6 mt-28"
      >
        <h2 className="text-3xl font-bold text-center mb-10">
          Why People Choose <span className="text-purple-500">TryNex</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <motion.div
            variants={fadeUp}
            className="p-6 bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-lg hover:border-purple-500 transition"
          >
            <Cpu className="text-purple-400 w-9 h-9" />
            <h3 className="font-semibold text-xl mt-4">Advanced AI Engine</h3>
            <p className="text-gray-400 mt-2">
              Built with cutting-edge ML models trained on thousands of outfits and body types.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={fadeUp}
            className="p-6 bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-lg hover:border-purple-500 transition"
          >
            <Shield className="text-purple-400 w-9 h-9" />
            <h3 className="font-semibold text-xl mt-4">Secure & Private</h3>
            <p className="text-gray-400 mt-2">
              User images are processed securely with strict privacy standards.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={fadeUp}
            className="p-6 bg-[#0f0f0f] border border-gray-700 rounded-xl shadow-lg hover:border-purple-500 transition"
          >
            <Zap className="text-purple-400 w-9 h-9" />
            <h3 className="font-semibold text-xl mt-4">Lightning Fast</h3>
            <p className="text-gray-400 mt-2">
              Ultra-fast rendering ensures try-ons are delivered within seconds.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* -------------------------------------- */}
      {/* 👥 TEAM SECTION */}
      {/* -------------------------------------- */}
      <section className="max-w-6xl mx-auto px-6 mt-28">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-10"
        >
          Meet the Minds Behind  
          <span className="text-purple-500"> TryNex</span>
        </motion.h2>

        {/* Rockstars Component */}
        <MeetOurRockstars />
      </section>

      <Footer />
    </div>
  );
};

export default AboutPage;
