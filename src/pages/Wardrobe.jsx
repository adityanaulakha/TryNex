import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Header from "../components/header";
import Sidebar from "../components/NavigationSidebar";
import { motion } from "framer-motion";

export default function VirtualWardrobe() {
  const navigate = useNavigate();
  const STORAGE_KEY = "trynex_history_v1";
  const USER_WARDROBE_KEY = "trynex_user_wardrobe";

  const [activeTab, setActiveTab] = useState("tryon-history"); // tryon-history | user-wardrobe | catalogue
  const [items, setItems] = useState([]);
  const [userWardrobe, setUserWardrobe] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadCategory, setUploadCategory] = useState("Tops");

  // Pre-defined catalogue items (trending fashion)
  const catalogueItems = [
    {
      id: "cat1",
      name: "Summer Breeze Dress",
      category: "Dresses",
      output: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80",
      meta: { styleScore: 95, category: "Dresses", name: "Summer Breeze Dress" }
    },
    {
      id: "cat2",
      name: "Classic Denim Jacket",
      category: "Tops",
      output: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      meta: { styleScore: 92, category: "Tops", name: "Classic Denim Jacket" }
    },
    {
      id: "cat3",
      name: "Elegant Black Gown",
      category: "Dresses",
      output: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80",
      meta: { styleScore: 98, category: "Dresses", name: "Elegant Black Gown" }
    },
    {
      id: "cat4",
      name: "Casual White Tee",
      category: "Tops",
      output: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80",
      meta: { styleScore: 88, category: "Tops", name: "Casual White Tee" }
    },
    {
      id: "cat5",
      name: "Leather Biker Jacket",
      category: "Tops",
      output: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80",
      meta: { styleScore: 94, category: "Tops", name: "Leather Biker Jacket" }
    },
    {
      id: "cat6",
      name: "Floral Maxi Dress",
      category: "Dresses",
      output: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80",
      meta: { styleScore: 91, category: "Dresses", name: "Floral Maxi Dress" }
    },
    {
      id: "cat7",
      name: "Striped Formal Pants",
      category: "Bottoms",
      output: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80",
      meta: { styleScore: 89, category: "Bottoms", name: "Striped Formal Pants" }
    },
    {
      id: "cat8",
      name: "Cozy Knit Sweater",
      category: "Tops",
      output: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80",
      meta: { styleScore: 90, category: "Tops", name: "Cozy Knit Sweater" }
    }
  ];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Load from localStorage on mount
  useEffect(() => {
    // Load try-on history
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const normalized = parsed.map((it) => {
          const meta = it.meta || {};
          return {
            id: it.id || `${meta.createdAt || Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            user: it.user || null,
            product: it.product || null,
            output: it.output || it.product || it.user || null,
            meta: {
              styleScore: meta.styleScore ?? Math.floor(Math.random() * 30 + 70),
              createdAt: meta.createdAt ?? Date.now(),
              category: meta.category ?? "Tops",
              name: meta.name ?? "Untitled Look",
              feedback: meta.feedback ?? "",
              tags: meta.tags ?? [],
            },
          };
        });
        normalized.sort((a, b) => b.meta.createdAt - a.meta.createdAt);
        setItems(normalized);
      } catch (e) {
        console.error("Failed to parse history from storage", e);
        setItems([]);
      }
    }

    // Load user wardrobe
    const wardrobeRaw = localStorage.getItem(USER_WARDROBE_KEY);
    if (wardrobeRaw) {
      try {
        const parsed = JSON.parse(wardrobeRaw);
        setUserWardrobe(parsed);
      } catch (e) {
        console.error("Failed to parse user wardrobe from storage", e);
        setUserWardrobe([]);
      }
    }
  }, []);

  // Apply category filter based on active tab
  useEffect(() => {
    let sourceItems = [];
    if (activeTab === "tryon-history") {
      sourceItems = items;
    } else if (activeTab === "user-wardrobe") {
      sourceItems = userWardrobe;
    } else if (activeTab === "catalogue") {
      sourceItems = catalogueItems;
    }

    if (category === "all") {
      setFiltered([...sourceItems]);
    } else {
      setFiltered(sourceItems.filter((it) => (it.meta?.category || it.category || "").toLowerCase() === category.toLowerCase()));
    }
  }, [items, userWardrobe, category, activeTab]);

  const categories = ["all", "Tops", "Bottoms", "Dresses", "Accessories"];

  async function handleAddToWardrobe() {
    if (selectedFiles.length === 0) return;

    // Convert files to base64 data URLs for persistent storage
    const filePromises = Array.from(selectedFiles).map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            name: file.name.replace(/\.[^/.]+$/, ""),
            category: uploadCategory,
            output: reader.result, // base64 data URL
            meta: {
              styleScore: Math.floor(Math.random() * 20 + 80),
              category: uploadCategory,
              name: file.name.replace(/\.[^/.]+$/, ""),
              createdAt: Date.now(),
            }
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const newItems = await Promise.all(filePromises);
    const updated = [...userWardrobe, ...newItems];
    setUserWardrobe(updated);
    
    // Save to localStorage with base64 data URLs
    localStorage.setItem(USER_WARDROBE_KEY, JSON.stringify(updated));
    
    // Reset modal state
    setShowUploadModal(false);
    setSelectedFiles([]);
    setUploadCategory("Tops");
  }

  function handleDelete(id) {
    if (!confirm("Delete this item?")) return;
    
    if (activeTab === "tryon-history") {
      const updated = items.filter((it) => it.id !== id);
      setItems(updated);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } else if (activeTab === "user-wardrobe") {
      const updated = userWardrobe.filter((it) => it.id !== id);
      setUserWardrobe(updated);
      localStorage.setItem(USER_WARDROBE_KEY, JSON.stringify(updated));
    }
    
    if (selected?.id === id) {
      setShowModal(false);
      setSelected(null);
    }
  }

  function handleDownload(url, filename = "trynex-tryon.jpg") {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handleRetry(record) {
    navigate("/virtual-tryon", { state: { retryRecord: record } });
  }

  function openModal(record) {
    setSelected(record);
    setShowModal(true);
  }

  const EmptyState = () => {
    const messages = {
      "tryon-history": {
        title: "No Try-On History Yet",
        desc: "Start creating virtual try-ons and they'll appear here automatically.",
        btnText: "Start Creating Looks",
        action: () => navigate("/virtual-tryon")
      },
      "user-wardrobe": {
        title: "Your Wardrobe is Empty",
        desc: "Upload your own clothing items to build your personal digital wardrobe.",
        btnText: "Add Items",
        action: () => setShowUploadModal(true)
      },
      "catalogue": {
        title: "Browse Our Trending Collection",
        desc: "Explore curated fashion pieces from current trends.",
        btnText: null,
        action: null
      }
    };

    const msg = messages[activeTab];

    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 py-20 text-center">
        <div className="w-40 h-40 rounded-2xl bg-purple-900/20 flex items-center justify-center border border-purple-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">{msg.title}</h3>
          <p className="text-gray-400 max-w-md">{msg.desc}</p>
        </div>
        {msg.btnText && (
          <button
            onClick={msg.action}
            className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
          >
            {msg.btnText}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onLogout={handleLogout} />
      
      <div className="min-h-screen bg-black text-gray-300 flex items-start justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[20rem_1fr] gap-6">
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT */}
            <main className="flex flex-col py-6">
              {/* Page Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">
                  Virtual <span className="text-purple-500">Wardrobe</span>
                </h1>
                <p className="text-gray-400">Your personal collection of curated high-end virtual fashion.</p>
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      setActiveTab("tryon-history");
                      setCategory("all");
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === "tryon-history"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Try-On History
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("user-wardrobe");
                      setCategory("all");
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === "user-wardrobe"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    My Wardrobe
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("catalogue");
                      setCategory("all");
                    }}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === "catalogue"
                        ? "bg-purple-600 text-white shadow-lg"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Trending Catalogue
                  </button>
                </div>

                {activeTab === "user-wardrobe" && (
                  <button
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Items
                  </button>
                )}
              </div>

              {/* Filter Bar */}
              <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                      category === cat
                        ? "bg-purple-600 text-white"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {cat === "all" ? "All Items" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Grid Content */}
              {filtered.length === 0 ? (
                <EmptyState />
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((it, idx) => (
                <motion.div
                  key={it.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all cursor-pointer"
                  onClick={() => openModal(it)}
                >
                  <div className="relative aspect-3/4 bg-gray-900 overflow-hidden">
                    <img
                      src={it.output}
                      alt={it.meta.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2">
                      <span className="text-yellow-400 text-xs">★</span>
                      <span className="text-white text-sm font-semibold">{it.meta.styleScore}</span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-base mb-1">{it.meta.name}</h3>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{it.meta.category}</span>
                      <span>★ {it.meta.styleScore}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

                  {/* Footer Summary */}
                  <div className="mt-8 flex items-center justify-between text-sm text-gray-400">
                    <div>
                      {filtered.length} {activeTab === "catalogue" ? "trending" : ""} items
                    </div>
                    {activeTab !== "catalogue" && (
                      <button
                        onClick={() => {
                          const msg = activeTab === "tryon-history" 
                            ? "Clear all try-on history?" 
                            : "Clear all items from your wardrobe?";
                          if (!confirm(msg)) return;
                          
                          if (activeTab === "tryon-history") {
                            localStorage.removeItem(STORAGE_KEY);
                            setItems([]);
                          } else if (activeTab === "user-wardrobe") {
                            localStorage.removeItem(USER_WARDROBE_KEY);
                            setUserWardrobe([]);
                          }
                          setFiltered([]);
                        }}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowUploadModal(false);
              setSelectedFiles([]);
              setUploadCategory("Tops");
            }}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-2xl w-full bg-gray-900 border border-white/10 rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Add to Wardrobe</h3>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSelectedFiles([]);
                  setUploadCategory("Tops");
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {categories.filter(c => c !== "all").map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setUploadCategory(cat)}
                      className={`py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                        uploadCategory === cat
                          ? "bg-purple-600 text-white shadow-lg scale-105"
                          : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* File Upload */}
              <div className="border-2 border-dashed border-purple-500/50 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setSelectedFiles(Array.from(e.target.files));
                    }
                  }}
                  className="hidden"
                  id="wardrobe-upload"
                />
                <label htmlFor="wardrobe-upload" className="cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-400">PNG, JPG, WEBP up to 10MB (Multiple files supported)</p>
                </label>
              </div>

              {/* File Preview */}
              {selectedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-300">Selected Files ({selectedFiles.length})</p>
                  <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-2 bg-white/5 rounded-lg">
                    {selectedFiles.map((file, idx) => (
                      <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setSelectedFiles(selectedFiles.filter((_, i) => i !== idx))}
                          className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowUploadModal(false);
                    setSelectedFiles([]);
                    setUploadCategory("Tops");
                  }}
                  className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToWardrobe}
                  disabled={selectedFiles.length === 0}
                  className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                >
                  Add to Wardrobe
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-5xl w-full bg-gray-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Left: Image */}
              <div className="bg-black flex items-center justify-center p-8">
                <img
                  src={selected.output}
                  alt={selected.meta.name}
                  className="max-h-[600px] w-full object-contain rounded-xl"
                />
              </div>

              {/* Right: Details */}
              <div className="p-8 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selected.meta.name}</h2>
                    <p className="text-sm text-gray-400">Category: {selected.meta.category}</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Style Score */}
                <div className="mb-6 p-6 bg-purple-900/20 rounded-2xl border border-purple-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-300">Style Score</span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-14 rounded-full bg-purple-600 flex items-center justify-center border-4 border-purple-400">
                        <span className="text-xl font-bold text-white">{selected.meta.styleScore}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-purple-400">
                    {selected.meta.styleScore >= 90 ? "Excellent" : selected.meta.styleScore >= 80 ? "Great" : "Good"}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Color Harmony: {selected.meta.styleScore}/100</div>
                </div>

                {/* AI Feedback */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-300 mb-2">AI Feedback</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {selected.meta.feedback || "This modern silhouette complements your frame. The color palette aligns perfectly with current trends. Consider adding a metallic accessory to elevate the look."}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-auto space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleRetry(selected)}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Re-Try
                    </button>
                    <button
                      onClick={() => handleDownload(selected.output)}
                      className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl transition-all"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setTimeout(() => handleDelete(selected.id), 300);
                    }}
                    className="w-full bg-red-600/20 hover:bg-red-600/30 text-red-400 py-3 rounded-xl transition-all"
                  >
                    Delete from Wardrobe
                  </button>
                  <button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share Story
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}