"use client";
import React from "react";
import { motion } from "framer-motion";
import CircularText from "./CircularText";
import {
  Wand2,
  Layers,
  ThumbsUp,
  Shuffle,
  Box,
  Cpu,
  SunMedium,
  Scan,
} from "lucide-react";

// Framer Variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const cardParentVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const KeyFeatures = () => {
  const features = [
    { icon: <Wand2 size={28} />, title: "AI Stylist", desc: "Get personalized style suggestions based on your preferences." },
    { icon: <Layers size={28} />, title: "Multi-category Try-On", desc: "Try on clothing, accessories, and more seamlessly." },
    { icon: <ThumbsUp size={28} />, title: "AI Outfit Rating", desc: "Receive instant feedback on outfit quality." },
    { icon: <Shuffle size={28} />, title: "Mix & Match Mode", desc: "Experiment with different combinations from your wardrobe." },
    { icon: <Box size={28} />, title: "Virtual Wardrobe", desc: "Save and organize your favorite outfits and items." },
    { icon: <Cpu size={28} />, title: "Batch Render Mode", desc: "Process multiple try-ons at once." },
    { icon: <SunMedium size={28} />, title: "Lighting Matching", desc: "See outfits in realistic lighting." },
    { icon: <Scan size={28} />, title: "AR Mirror", desc: "Experience live AR try-on. (Coming soon)" },
  ];

  return (
    <section className="w-full py-20 px-6 bg-black text-white flex flex-col items-center relative">
        <div className="hidden md:block absolute top-25 right-64">
            <CircularText
            text="TRYNEX * TRY ON * FASHION *"
            size={250}
            speed={10}
            />
        </div>
        <div className="hidden md:block absolute -bottom-5 left-64">
            <CircularText
            text="TRYNEX * TRY ON * FASHION *"
            size={250}
            speed={10}
            />
        </div>
        

      {/* Heading */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-center">
          Key Features
        </h2>
        <p className="text-gray-400 text-center mt-3 max-w-2xl">
          Explore the powerful tools that make TryNex AI the ultimate virtual try-on experience.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <motion.div
        variants={cardParentVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12 w-full max-w-6xl"
      >
        {features.map((f, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            whileHover={{ scale: 1.06, borderColor: "#8b5cf6" }}
            transition={{ type: "spring", stiffness: 180, damping: 20 }}
            className="
              bg-[#111]/90 
              border border-gray-700/40 
              rounded-2xl p-6 
              backdrop-blur-lg 
              shadow-xl 
              hover:shadow-[0_0_20px_#8b5cf660]
              hover:border-blue-300 
              transition-all duration-300
            "
          >
            <div className="text-purple-400 mb-3">{f.icon}</div>

            <h3 className="font-semibold text-lg">{f.title}</h3>
            <p className="text-gray-400 text-sm mt-1 leading-relaxed">
              {f.desc}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default KeyFeatures;
