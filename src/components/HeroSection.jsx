"use client";
import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { motion } from "framer-motion";


const HeroSection = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.from(titleRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.8,
      ease: "power3.out",
    })
      .from(
        subtitleRef.current,
        {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      )
      .from(
        buttonRef.current,
        {
          opacity: 0,
          scale: 0.85,
          duration: 0.6,
          ease: "back.out(1.6)",
        },
        "-=0.3"
      )
      .from(
        imageRef.current,
        {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
        },
        "-=0.4"
      );
  }, []);

  return (
    <section className="w-full pt-36 pb-20 flex flex-col items-center text-center px-6 bg-black">
      {/* Title */}
      <h1
        ref={titleRef}
        className="text-white text-4xl md:text-6xl font-extrabold leading-tight max-w-4xl"
      >
        Try Anything, Anywhere — <br />
        Powered by <span className="text-blue-400">
            AI.
            </span>
      </h1>

      {/* Subtitle */}
      <p
        ref={subtitleRef}
        className="text-gray-300 text-lg md:text-xl mt-4 max-w-2xl"
      >
        Upload your photo + any product image → get instant ultra-realistic
        try-on results.
      </p>

      {/* Buttons */}
      <div
        ref={buttonRef}
        className="flex gap-4 mt-8 items-center justify-center"
      >
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/auth")}
          className="border border-zinc-600 hover:border-zinc-400 text-white px-6 py-3 rounded-full font-semibold shadow-md"
        >
          Start Free Trial
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/auth")}
          className=" text-white border-blue-700 px-6 py-3 rounded-full font-semibold border hover:border-blue-400"
        >
          Try Demo
        </motion.button>
      </div>

      {/* Image */}
      <div
        ref={imageRef}
        className="mt-12 w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-lg"
      >
        <img
          src="https://imgs.search.brave.com/OBvXkeiq33LQnwnVV-UsgdNLi4l-irXcyJ4i3CpV6xk/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzA0LzYzLzc0LzU0/LzM2MF9GXzQ2Mzc0/NTQ3Nl9mUTZFS0Vm/b2ZQUW9YbXY0OUFN/TlhjUlVQc1ZWVjNM/TC5qcGc"
          alt="AI Try-On Visual"
          className="w-full h-full object-contain rounded-xl"
        />
      </div>
    </section>
  );
};

export default HeroSection;
