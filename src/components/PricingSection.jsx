"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$0",
    monthly: "/month",
    popular: false,
    features: [
      "10 renders per month",
      "Basic virtual wardrobe",
      "Standard quality output",
    ],
    button: "Get Started",
    buttonStyle: "bg-white/10 hover:bg-white/20 text-white",
  },
  {
    name: "Pro",
    price: "$10",  // UPDATED
    monthly: "/month",
    popular: true,
    features: [
      "Unlimited renders",
      "AI Stylist Recommendations",
      "High Quality Renders",
      "Priority Support",
    ],
    button: "Start Free Trial",
    buttonStyle:
      "bg-gradient-to-r from-purple-500 to-indigo-500 hover:brightness-110 text-white",
  },
  {
    name: "Enterprise",
    price: "$49",
    monthly: "/month",
    popular: false,
    features: [
      "Batch rendering mode",
      "API Access & Integrations",
      "Brand outfit integration",
      "Dedicated account manager",
    ],
    button: "Contact Us",   // UPDATED
    buttonStyle: "bg-white/10 hover:bg-white/20 text-white",
  },
];

const PricingSection = () => {
  const [activePlan, setActivePlan] = useState("Pro");

  return (
    <section className="w-full py-24 px-6 bg-black text-white relative overflow-hidden">

      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[140px] rounded-full" />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          Simple & Transparent Pricing
        </h2>
        <p className="text-gray-400 mt-4 max-w-xl mx-auto text-lg">
          Choose the perfect plan for your virtual try-on experience.
        </p>
      </motion.div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-5xl mx-auto">
        {plans.map((plan, i) => {
          const isActive = activePlan === plan.name;

          return (
            <motion.div
              key={i}
              onClick={() => setActivePlan(plan.name)}
              initial={{ opacity: 0, y: 70 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              viewport={{ once: true }}
              animate={isActive ? { scale: 1.06, y: -6 } : { scale: 1, y: 0 }}
              className={`relative rounded-2xl p-[2px] cursor-pointer transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-b from-purple-500 to-indigo-700 shadow-[0_0_35px_#7c3aed40]"
                  : "bg-white/5"
              }`}
            >
              {/* Inner Card */}
              <div className="rounded-2xl bg-[#0c0c0c]/90 backdrop-blur-xl p-10 h-full shadow-lg shadow-black/50">

                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white px-4 py-1 text-xs font-semibold rounded-full shadow-lg"
                  >
                    Most Popular
                  </motion.div>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold">{plan.name}</h3>

                {/* Price */}
                <div className="mt-4 mb-8 flex items-end gap-1">
                  <span className="text-5xl font-extrabold">{plan.price}</span>
                  <span className="text-gray-400">{plan.monthly}</span>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-4 mb-10">
                  {plan.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-3 text-gray-300 text-sm"
                    >
                      <Check size={18} className="text-purple-400" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`w-full rounded-xl px-6 py-3 font-semibold text-md transition ${plan.buttonStyle}`}
                >
                  {plan.button}
                </button>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default PricingSection;
