"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Sparkles, Crown, Rocket } from "lucide-react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const plans = [
  {
    name: "Starter",
    price: "$0",
    desc: "Try AI outfit previews with essential features.",
    icon: <Sparkles className="w-8 h-8 text-blue-400" />,
    features: [
      "10 Try-ons per month",
      "Basic AI clothing render",
      "Standard resolution output",
      "Email support",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$10",
    desc: "Unlimited AI try-ons with advanced quality for everyday shoppers.",
    icon: <Crown className="w-8 h-8 text-blue-500" />,
    features: [
      "Unlimited Try-ons",
      "HD Rendering Engine",
      "AI lighting & shadow match",
      "Save outfits to virtual wardrobe",
      "Priority support",
    ],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    desc: "Ideal for brands, stores, and professional stylists.",
    icon: <Rocket className="w-8 h-8 text-blue-400" />,
    features: [
      "Batch render mode",
      "Brand outfit integration",
      "API access for developers",
      "Custom AI styling engine",
      "Dedicated account manager",
    ],
    highlight: false,
  },
];

const PricingPage = () => {

  // ⭐ Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full bg-black text-white py-28 px-6">
      
      <NavBar />

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold">
          Choose Your <span className="text-blue-500">Plan</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mt-4 text-lg">
          Get the perfect virtual try-on plan tailored to your needs.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto mt-20 mb-16">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, boxShadow: "0 0 30px #3b82f670" }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`p-8 rounded-2xl border ${
              plan.highlight
                ? "border-blue-500 bg-[#0f0f0f] shadow-[0_0_30px_#3b82f650]"
                : "border-gray-700 bg-[#0c0c0c]"
            }`}
          >
            {/* Icon */}
            <div className="mb-4">{plan.icon}</div>

            {/* Plan Name */}
            <h2 className="text-2xl font-bold">{plan.name}</h2>

            {/* Price */}
            <p className="text-blue-400 text-4xl font-extrabold mt-4">
              {plan.price}
              <span className="text-gray-500 text-lg font-medium"> / month</span>
            </p>

            {/* Description */}
            <p className="text-gray-400 mt-3 text-sm">{plan.desc}</p>

            {/* Features */}
            <ul className="mt-6 flex flex-col gap-3">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${
                plan.name === "Enterprise"
                  ? "border border-blue-500 hover:bg-blue-600 hover:border-blue-600"
                  : plan.highlight
                  ? "bg-blue-600 hover:bg-blue-700 shadow-lg"
                  : "border border-blue-500 hover:bg-blue-600 hover:border-blue-600"
              }`}
            >
              {plan.name === "Enterprise"
                ? "Contact Us"
                : plan.highlight
                ? "Get Pro"
                : "Choose Plan"}
            </button>
          </motion.div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default PricingPage;
