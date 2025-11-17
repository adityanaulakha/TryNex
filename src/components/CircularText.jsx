"use client";
import { motion } from "framer-motion";

export default function CircularText({
  text = "REACT * COMPONENTS * BITS * ",
  size = 220,
  speed = 12,
}) {
  const characters = text.split("");

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, ease: "linear", duration: speed }}
      style={{ width: size, height: size }}
      className="relative flex items-center justify-center"
    >
      {characters.map((char, i) => (
        <span
          key={i}
          style={{
            position: "absolute",
            transform: `rotate(${(360 / characters.length) * i}deg)
                        translate(${size / 2.6}px)`,
            transformOrigin: "center center",
          }}
          className="text-white font-bold tracking-widest text-xl select-none"
        >
          {char}
        </span>
      ))}
    </motion.div>
  );
}
