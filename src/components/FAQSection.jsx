"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";

const faqs = [
  {
    q: "How does the AI virtual try-on work?",
    a: "Upload your photo and the clothing image, and our AI instantly renders a realistic preview of how the outfit will look on you.",
  },
  {
    q: "Is my photo stored or used anywhere?",
    a: "Your images are private and securely processed. TryNex never shares or uses your photos for training without consent.",
  },
  {
    q: "Do I need a perfect photo for accurate try-ons?",
    a: "Not at all! A clear front-facing photo with decent lighting works best. The AI automatically adjusts fit, lighting, and body shape.",
  },
  {
    q: "Can the AI stylist recommend outfits?",
    a: "Yes! Our built-in AI fashion stylist suggests clothing based on your style, body shape, occasion, and current wardrobe.",
  },
  {
    q: "Does TryNex work for all clothing types?",
    a: "TryNex supports tops, dresses, jackets, ethnic wear, and more. We're continuously adding support for new clothing categories.",
  },
];


const FAQSection = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="w-full py-20 px-6 bg-black text-white">
      {/* Heading */}
      <div className="text-center mb-12">
        <p className="text-sm text-purple-400 tracking-wide">FAQs</p>
        <h2 className="text-4xl md:text-5xl font-extrabold">
          Frequently Asked <span className="text-purple-400 italic">questions</span>
        </h2>
      </div>

      {/* Content Layout */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* FAQ List */}
        <div className="flex flex-col gap-4">
          {faqs.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`rounded-xl p-5 cursor-pointer shadow-lg border transition-all
                ${
                  active === i
                    ? "bg-purple-600 text-white border-purple-500"
                    : "bg-[#111]/80 border-white/10 hover:border-purple-400/40"
                }`}
              onClick={() => setActive(active === i ? -1 : i)}
            >
              {/* Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{item.q}</h3>
                {active === i ? (
                  <ChevronDown className="text-white" />
                ) : (
                  <ChevronRight className="text-gray-300" />
                )}
              </div>

              {/* Expand Content */}
              <AnimatePresence>
                {active === i && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35 }}
                    className="text-sm text-white/90 mt-3 leading-relaxed"
                  >
                    {item.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Right Side Image Box */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="rounded-2xl bg-[#111]/60 border border-white/10 p-4 backdrop-blur-xl shadow-xl"
        >
          <img
            src="https://imgs.search.brave.com/PQyQZFbNtz2O2BAql6Vrn9EyZyObXvcL_p5r_51s-Cw/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9pbmRvb3ItZmFz/aGlvbi1zaG9vdC1m/ZWF0dXJpbmctZ2Vu/LXotbW9kZWxzLXdp/dGgtbGF5ZXJlZC1j/bG90aGluZy1tb2Rl/cm4tYWNjZXNzb3Jp/ZXMtdW5pcXVlLWNv/bWJpbmF0aW9ucy1z/dHlsZXNfMTIxNDE3/My00ODkxMS5qcGc_/c2VtdD1haXNfaW5j/b21pbmcmdz03NDAm/cT04MA"
            alt="FAQ visual"
            className="rounded-xl w-full object-cover h-[400px]"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default FAQSection;
