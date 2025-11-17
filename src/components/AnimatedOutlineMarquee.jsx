"use client";
import React from "react";
import { motion } from "framer-motion";

const AnimatedOutlineMarquee = () => {
  const text =
    "Partnerships, Lasting Impact, Global Innovation, Partnerships, Lasting Impact, Global Innovation";

  return (
    <section className="relative w-full bg-black py-24 overflow-hidden">
      {/* Fade Overlays */}
      <div className="pointer-events-none absolute left-0 top-0 h-full w-40 bg-linear-to-r from-[#0F0F11] to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-40 bg-linear-to-l from-[#0F0F11] to-transparent z-20" />

      {/* Scrolling Wrapper */}
      <div className="flex whitespace-nowrap">
        {/* First copy */}
        <motion.h1
          className="text-[80px] md:text-[130px] font-extrabold tracking-tight text-transparent stroke-text px-6"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {text}
        </motion.h1>

        {/* Second copy (seamless loop) */}
        <motion.h1
          className="text-[80px] md:text-[130px] font-extrabold tracking-tight text-transparent stroke-text px-6"
          initial={{ x: 0 }}
          animate={{ x: "-100%" }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {text}
        </motion.h1>
      </div>
    </section>
  );
};

export default AnimatedOutlineMarquee;
