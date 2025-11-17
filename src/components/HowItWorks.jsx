"use client";
import React from "react";
import { motion } from "framer-motion";
import { Upload, Package, Cog, Eye, Bookmark } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: "easeOut" },
  }),
};

const steps = [
  {
    icon: <Upload size={26} />,
    title: "Upload Image",
    desc: "Start with your photo.",
    active: true,
  },
  {
    icon: <Package size={26} />,
    title: "Upload Product",
    desc: "Add an item to try.",
  },
  {
    icon: <Cog size={26} />,
    title: "AI Renders",
    desc: "Our AI gets to work.",
  },
  {
    icon: <Eye size={26} />,
    title: "Preview",
    desc: "See the magic happen.",
  },
  {
    icon: <Bookmark size={26} />,
    title: "Wardrobe",
    desc: "Save your favorites.",
  },
];

const HowItWorks = () => {
  return (
    <section className="w-full py-20 px-6 bg-black text-white flex flex-col items-center">
      
      {/* Heading */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col items-center text-center"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold">How It Works</h2>
        <p className="text-gray-300 mt-3 max-w-2xl">
          A simple, intuitive flow from upload to virtual wardrobe in just a few clicks.
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative mt-12 w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Dotted Line (Desktop Only) */}
        <div className="hidden md:block absolute left-0 right-0 border-t border-dashed border-gray-500/40"></div>

        {steps.map((step, index) => (
          <motion.div
            key={index}
            custom={index}
            variants={itemVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center text-center md:min-w-[130px]"
          >
            {/* Icon Circle */}
            <div
              className={`w-14 h-14 flex items-center justify-center rounded-full transition-all ${
                step.active
                  ? "border-2 border-purple-500 bg-purple-500/10 text-purple-400"
                  : "border border-gray-500/30 bg-white/5 text-gray-300"
              }`}
            >
              {step.icon}
            </div>

            {/* Title */}
            <h3 className="mt-4 font-semibold text-lg">{step.title}</h3>

            {/* Description */}
            <p className="text-gray-300 text-sm mt-1">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
