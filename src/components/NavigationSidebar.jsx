import React from "react";
import { Sparkles, Shirt, Layers, Bot, View } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { id: 1, label: "Visual Try-On", icon: Shirt, path: "/virtual-tryon" },
  { id: 2, label: "Wardrobe", icon: Layers, path: "/wardrobe" },
  // { id: 3, label: "Mix & Match", icon: Sparkles, path: "/mix-match" },
  { id: 3, label: "AI Chat Styler", icon: Bot, path: "/ai-chat-styler" },
  { id: 4, label: "Web AR Feature", icon: View, path: "/webar" },
];

export default function Sidebar({ mobile = false }) {
  return (
    <aside
      className={`${mobile ? "block" : "hidden xl:block"} bg-black w-64 h-full rounded-2xl p-6 shadow-[0_0_15px_rgba(147,51,234,0.25)] border border-white/20`}
    >
      <h2 className="text-xl font-bold text-white mb-8">Menu</h2>

      <ul className="space-y-3">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded-lg transition-all cursor-pointer
                 ${
                   isActive
                     ? "border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)] bg-purple-600/10"
                     : "hover:bg-white/5"
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={isActive ? "text-purple-500" : "text-gray-400"}
                  />
                  <span
                    className={`font-semibold ${
                      isActive ? "text-white" : "text-gray-300"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </ul>
    </aside>
  );
}
