import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/NavigationSidebar";
import { Sparkles, Camera, Cpu, Layers, Zap, View } from "lucide-react";

export default function ArVision() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="min-h-screen bg-black text-gray-300 flex items-start justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[20rem_1fr] gap-6">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex flex-col py-6">
              {/* Hero */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-br from-purple-900/40 via-fuchsia-700/20 to-black p-8 md:p-10 mb-8">
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-purple-200 mb-4">
                      <Sparkles size={14} />
                      Coming Soon
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                      Web <span className="text-purple-500">AR Vision</span>
                    </h1>
                    <p className="mt-3 text-gray-300 max-w-2xl">
                      Future Scope — Try-on that blends with your world. Real-time overlays, lighting, and motion — all in your browser.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-gray-300">Future Scope</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-gray-300">Coming Soon</span>
                      <span className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10 text-gray-300">No App Required</span>
                    </div>
                  </div>

                  {/* Device Mock */}
                  <div className="w-full md:w-80 lg:w-96">
                    <div className="relative aspect-9/16 rounded-4xl border border-white/20 bg-black overflow-hidden shadow-[0_0_40px_rgba(168,85,247,0.3)]">
                      {/* grid */}
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-size-[16px_16px]"></div>
                      </div>
                      {/* AR frame placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[78%] h-[60%] rounded-2xl border-2 border-purple-400/50 bg-purple-500/10 backdrop-blur-sm flex items-center justify-center">
                          <div className="text-center px-4">
                            <View className="mx-auto mb-3 text-purple-300" size={28} />
                            <p className="text-sm text-purple-200 font-semibold">AR Preview</p>
                            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
                          </div>
                        </div>
                      </div>
                      {/* camera notch */}
                      <div className="absolute top-0 inset-x-0 h-6">
                        <div className="mx-auto mt-1 h-5 w-40 rounded-b-2xl bg-black/80 border border-white/10"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* glow */}
                <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-500/20 blur-3xl rounded-full" />
                <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-fuchsia-500/10 blur-3xl rounded-full" />
              </div>

              {/* Future Scope Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    icon: Camera,
                    title: "Real‑Time Body Tracking",
                    desc: "Lock outfits to body movement with smooth, natural follow‑through.",
                  },
                  {
                    icon: Layers,
                    title: "Garment Overlay + Fit",
                    desc: "Adaptive drape and scale for different silhouettes and poses.",
                  },
                  {
                    icon: Zap,
                    title: "Lighting & Shadows",
                    desc: "Blend with ambient light for believable AR scenes.",
                  },
                  {
                    icon: Cpu,
                    title: "On‑Device ML",
                    desc: "Smart segmentation and occlusion — right in the browser.",
                  },
                  {
                    icon: Sparkles,
                    title: "Styling Hints",
                    desc: "Subtle guides and tips on composition, colors, and accessories.",
                  },
                  {
                    icon: View,
                    title: "Space Anchors",
                    desc: "Place mannequins or looks in your room with persistent anchors.",
                  },
                ].map(({ icon: Icon, title, desc }, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-purple-500/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-purple-600/20 text-purple-300 border border-purple-500/20">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{desc}</p>
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                  </div>
                ))}
              </section>

              {/* CTA Strip */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <h4 className="text-lg font-semibold text-white">Coming Soon — Web AR is in active design</h4>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-600/20 border border-purple-500/30 text-purple-200">Preview</span>
                  <button
                    disabled
                    className="px-5 py-2 rounded-lg bg-purple-600/50 text-white font-semibold border border-purple-500/40 cursor-not-allowed"
                  >
                    Notify Me
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
