import React, { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import aditya from "../assets/aditya.png";
import vansh from "../assets/vansh.jpg";
import div from "../assets/div.png";
import harsh from "../assets/harsh.png";
import akshat from "../assets/akshat.png";

const members = [
  {
    name: "Aditya Naulakha",
    role: "Team Leader",
    img: aditya,
  },
  {
    name: "Vansh Sharma",
    role: "Full Stack Developer",
    img: vansh,
  },
  {
    name: "Harsh Vardhan Gupta",
    role: "Flutter Developer",
    img: harsh,
  },
  {
    name: "Akshat Jain",
    role: "UI/UX Designer",
    img: akshat,
  },
  {
    name: "Divyansh Sharma",
    role: "UI/UX Designer",
    img: div,
  },
];

const MeetOurRockstars = () => {
  const scrollRef = useRef(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -400, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 400, behavior: "smooth" });
  };

  return (
    <section className="w-full bg-black text-white py-20 px-6 relative overflow-hidden">

      {/* Heading */}
      <p className="text-gray-400 text-xl font-medium">
        Creators, Innovators & Game-Changers
      </p>
      <h2 className="text-4xl md:text-6xl font-extrabold mt-2">
        Meet Our <span className="text-purple-500">Rockstars</span>
      </h2>

      {/* Buttons */}
      <div className="absolute right-6 top-10 flex gap-4 z-10">
        <button onClick={scrollLeft}
          className="border border-white/40 rounded-lg p-3 hover:bg-white/10 transition">
          <ArrowLeft />
        </button>
        <button onClick={scrollRight}
          className="border border-white/40 rounded-lg p-3 hover:bg-white/10 transition">
          <ArrowRight />
        </button>
      </div>

      {/* Cards */}
      <div
        ref={scrollRef}
        className="mt-12 flex gap-8 overflow-x-scroll scroll-smooth scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>
          {`
            .scrollbar-hide::-webkit-scrollbar { display: none; }
          `}
        </style>

        {members.map(({ name, role, img }, index) => (
          <div
            key={index}
            className="min-w-[300px] bg-[#0d0d0d] rounded-3xl shadow-lg 
                      border border-purple-500/20 hover:border-purple-500/60 
                      transition duration-300"
          >
            <div className="w-full h-80 bg-black flex items-center justify-center">
              <img
                src={img}
                alt={name}
                className="w-full h-full object-contain rounded-t-3xl"
              />
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold">{name}</h3>
              <p className="text-gray-400 mt-1">{role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetOurRockstars;
