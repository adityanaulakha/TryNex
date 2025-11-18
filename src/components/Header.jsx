import React, { useState } from "react";
import { LogOut, Menu, X } from "lucide-react";
import Sidebar from "./NavigationSidebar";

export default function Header({ onLogout }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <>
      <header className="w-full bg-black border-b border-white/10 py-4 px-6 shadow-[0_0_10px_rgba(147,51,234,0.2)] flex items-center justify-between">
        {/* Left: Mobile hamburger (xl hidden) keeps logo centered */}
        <div className="w-20 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition"
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>

        {/* Center Logo */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">
              Try<span className="text-purple-500">Nex</span>
          </h1>
        </div>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(168,85,247,0.5)]"
        >
          <LogOut size={18} />
          Logout
        </button>
      </header>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="xl:hidden fixed inset-0 z-1000">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80%] bg-black border-r border-white/10 shadow-2xl">
            <div className="flex items-center justify-end p-3">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:bg-white/10 transition"
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>
            <div className="p-4">
              <Sidebar mobile />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
