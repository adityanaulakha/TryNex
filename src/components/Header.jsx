import React from "react";
import { LogOut } from "lucide-react";

export default function Header({ onLogout }) {
  return (
    <header className="w-full bg-black border-b border-white/10 py-4 px-6 shadow-[0_0_10px_rgba(147,51,234,0.2)] flex items-center justify-between">
      
      {/* Left Spacer (keeps logo centered) */}
      <div className="w-20"></div>

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
  );
}
