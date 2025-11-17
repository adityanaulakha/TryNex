import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { useAuth } from "../context/AuthContext.jsx";

const NavBar = () => {
  const navigate = useNavigate();
  const navRef = useRef(null);
  const linkRefs = useRef([]);
  const ctaRef = useRef(null);
  const drawerRef = useRef(null);
  const [open, setOpen] = useState(false);
  const { isLoggedIn } = useAuth();

  // === GSAP NAVBAR ENTRY ANIMATION ===
  useEffect(() => {
    gsap.from(navRef.current, {
      y: -70,
      opacity: 0,
      duration: 0.9,
      ease: "power3.out",
    });

    gsap.from(linkRefs.current, {
      opacity: 0,
      y: -15,
      duration: 0.6,
      stagger: 0.15,
      delay: 0.3,
      ease: "power3.out",
    });

    gsap.from(ctaRef.current, {
      opacity: 0,
      scale: 0.85,
      delay: 0.7,
      duration: 0.6,
      ease: "back.out(1.5)",
    });
  }, []);

  // 🚀 Navigate to Login or Try-On based on auth state
  const handleNavigate = () => {
    if (isLoggedIn) navigate("/virtual-tryon");
    else navigate("/auth");
  };

  // 🚀 Navigate to specific page
  const goTo = (path) => {
    navigate(path);
    setOpen(false);
  };

  // === MOBILE DRAWER ANIMATION ===
  const openMenu = () => {
    setOpen(true);

    setTimeout(() => {
      gsap.fromTo(
        drawerRef.current,
        { x: 250, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
      );
    }, 10);
  };

  const closeMenu = () => {
    gsap.to(drawerRef.current, {
      x: 300,
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => setOpen(false),
    });
  };

  const navLinks = [
    { label: "About", id: "/about" },
    { label: "Pricing", id: "/pricing" },
    { label: "Contact Us", id: "/contact" },
  ];

  return (
    <header className="w-full fixed top-0 left-0 z-1000 px-4 py-3">
      <div
        ref={navRef}
        className="mx-auto max-w-[1000px] px-6 py-4 rounded-full backdrop-blur-3xl flex items-center justify-between shadow-md border border-blue-500"
        style={{ position: "relative", zIndex: 1 }}
      >
        {/* LOGO */}
        <div
          className="text-white text-2xl font-extrabold cursor-pointer uppercase"
          onClick={() => navigate("/")}
        >
          TryNex
        </div>

        {/* DESKTOP LINKS */}
        <nav className="hidden md:flex gap-10 text-white font-semibold tracking-wide">
          {navLinks.map((item, index) => (
            <button
              key={item.id}
              ref={(el) => (linkRefs.current[index] = el)}
              onClick={() => goTo(item.id)}
              className="relative after:absolute after:bottom-0 after:left-0 after:h-0.5px after:w-0 after:bg-purple-400 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* CTA BUTTON (DESKTOP LOGIN / TRY-ON) */}
        <button
          onClick={handleNavigate}
          ref={ctaRef}
          className="hidden md:block border-blue-500 border rounded-xl text-white px-6 py-2 text-md font-semibold hover:bg-blue-500"
        >
          {isLoggedIn ? "Try-On" : "Login"}
        </button>

        {/* MOBILE MENU ICON */}
        <button className="md:hidden" onClick={openMenu}>
          <Menu size={30} className="text-white" />
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {open && (
        <div className="fixed inset-0 bg-black backdrop-blur-sm z-1000 flex justify-end">
          <div
            ref={drawerRef}
            className="w-[75%] sm:w-[45%] h-full bg-[#130C42] shadow-2xl p-6 flex flex-col"
          >
            {/* CLOSE BUTTON */}
            <div className="flex justify-end">
              <button onClick={closeMenu}>
                <X size={34} className="text-white" />
              </button>
            </div>

            {/* MOBILE LINKS */}
            <div className="flex flex-col mt-6 gap-6 text-lg font-semibold text-white">
              {navLinks.map((item) => (
                <button
                  key={item.id}
                  onClick={() => goTo(item.id)}
                  className="pb-3 border-b border-gray-200"
                >
                  {item.label}
                </button>
              ))}

              {/* MOBILE LOGIN/TRY-ON CTA */}
              <button
                onClick={handleNavigate}
                className="mt-4 border-blue-500 border text-white text-[17px] px-6 py-3 rounded-xl shadow-md hover:bg-blue-500 transition"
              >
                {isLoggedIn ? "Try-On" : "Login"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
