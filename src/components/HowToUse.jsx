import React from "react";
import { Upload, Shirt, Sparkles, Wand2 } from "lucide-react";

export default function HowToUsePanel() {
  const steps = [
    {
      id: 1,
      title: "Upload Your Photo",
      description:
        "Upload a clear front-facing picture of yourself for best results.",
      icon: Upload,
    },
    {
      id: 2,
      title: "Upload Product Image",
      description:
        "Select any garment or outfit image you want to try on.",
      icon: Shirt,
    },
    {
      id: 3,
      title: "Generate Try-On",
      description:
        "Click the Generate Try-On button and let the AI create your look.",
      icon: Sparkles,
    },
    {
      id: 4,
      title: "Explore Styles",
      description:
        "Save your results, compare looks, and experiment with different outfits.",
      icon: Wand2,
    },
  ];

  return (
    <aside className="bg-black rounded-2xl p-6 h-full shadow-[0_0_15px_rgba(147,51,234,0.3)] border border-white/20">
      <h2 className="text-xl font-bold text-white mb-6">How to Use</h2>

      <div className="space-y-5">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="flex items-start gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 cursor-default transition-all"
            >
              <div className="p-3 rounded-lg border border-purple-500">
                <Icon className="text-purple-400" size={22} />
              </div>

              <div>
                <p className="text-white font-semibold">{step.title}</p>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
