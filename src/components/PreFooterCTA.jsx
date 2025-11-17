"use client";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PreFooterCTA() {
  return (
    <div className="w-[400px] md:w-[800px] mx-auto py-16">
      <div className="relative w-full border border-purple-400 rounded-3xl overflow-hidden py-20 flex items-center justify-center px-6 mx-auto">

        {/* FLOATING PURPLE TRIANGLES */}
        <motion.div
          className="absolute top-20 left-[22%] text-purple-400 text-xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ▼
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-[18%] text-purple-400 text-xl"
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          ▼
        </motion.div>

        <motion.div
          className="absolute bottom-12 left-1/2 text-purple-400 text-xl"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        >
          ▼
        </motion.div>

        {/* MOVING CURVED LINE */}
        <motion.div
          className="absolute w-[160%] opacity-[0.18]"
          animate={{ x: [-50, 50, -50] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        >
          <svg viewBox="0 0 900 300" className="w-full">
            <path
              d="M 0 200 Q 250 0 450 180 T 900 180"
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </motion.div>

        {/* TEXT CONTENT */}
        <div className="relative z-10 text-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold leading-snug">
            Ready to See Yourself <br />
            In Your Next Outfit?
          </h1>

          <div className="flex items-center justify-center mt-6 cursor-pointer group">
            <p className="text-gray-300 text-lg">
              Try AI-powered virtual try-ons now.
            </p>
            <ArrowRight className="ml-2 text-gray-300 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}
