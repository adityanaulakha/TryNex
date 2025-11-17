"use client";
import React from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-black text-white pt-20 pb-10 px-6 relative overflow-hidden">

      {/* Subtle gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-purple-900/20 to-transparent pointer-events-none" />

      {/* Footer Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12"
      >
        {/* Brand Section */}
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2 uppercase">
            <span className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]"></span>
            TryNex AI
          </h2>
          <p className="text-gray-400 mt-3 text-sm leading-relaxed">
            The future of fashion, personalized for you.
          </p>
        </div>

        {/* Product */}
        <div>
          <h3 className="text-white font-semibold text-lg">Product</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="hover:text-purple-400 transition cursor-pointer">Features</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Pricing</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Demo</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Updates</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-white font-semibold text-lg">Company</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="hover:text-purple-400 transition cursor-pointer">About Us</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Careers</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="text-white font-semibold text-lg">Resources</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="hover:text-purple-400 transition cursor-pointer">Blog</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Help Center</li>
            <li className="hover:text-purple-400 transition cursor-pointer">API Docs</li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-white font-semibold text-lg">Legal</h3>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li className="hover:text-purple-400 transition cursor-pointer">Terms of Service</li>
            <li className="hover:text-purple-400 transition cursor-pointer">Privacy Policy</li>
          </ul>
        </div>
      </motion.div>

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto mt-14 border-t border-zinc-400"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between mt-6 gap-4">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} TryNex AI. All rights reserved.
        </p>

        {/* Social Icons */}
        <div className="flex items-center gap-5 text-gray-400">
          <Facebook className="w-5 h-5 hover:text-purple-400 transition cursor-pointer" />
          <Twitter className="w-5 h-5 hover:text-purple-400 transition cursor-pointer" />
          <Instagram className="w-5 h-5 hover:text-purple-400 transition cursor-pointer" />
        </div>
      </div>
    </footer>
  );
};

export default Footer; 