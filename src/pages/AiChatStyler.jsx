import React, { useState, useEffect, useRef } from "react";
import { analyzeTryOnImage, analyzeUserAndProduct } from "../services/geminiService";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Header from "../components/Header";
import Sidebar from "../components/NavigationSidebar";
import { motion } from "framer-motion";
import Markdown from "../components/Markdown";

export default function AiChatStyler() {
  const navigate = useNavigate();
  const STORAGE_KEY = "trynex_chat_history_v1";
  const TRYON_HISTORY_KEY = "trynex_history_v1";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [persistNotice, setPersistNotice] = useState("");
  
  // Image upload states
  const [userImage, setUserImage] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [userImagePreview, setUserImagePreview] = useState(null);
  const [productImagePreview, setProductImagePreview] = useState(null);
  // Bulk upload (multiple try-on images at once)
  const [bulkImages, setBulkImages] = useState([]);
  const [bulkPreviews, setBulkPreviews] = useState([]);
  
  // Try-on history modal
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [tryonHistory, setTryonHistory] = useState([]);

  const bottomRef = useRef(null);

  function handleClearChat() {
    const ok = confirm("Clear all chat messages?");
    if (!ok) return;
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      setPersistNotice("");
    } catch {}
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Helper: normalize history records to ensure an image src exists
  function normalizeHistory(list) {
    if (!Array.isArray(list)) return [];
    return list
      .map((it) => {
        const img = it.output || it.generated || it.imageUrl || it.product || it.user;
        if (!img) return null;
        return {
          id: it.id || `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          output: img,
          meta: it.meta || {},
        };
      })
      .filter(Boolean);
  }

  // Load chat history
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setMessages(parsed);
      } catch {}
    }

    // Load try-on history
    const historyRaw = localStorage.getItem(TRYON_HISTORY_KEY);
    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw);
        setTryonHistory(normalizeHistory(parsed));
      } catch {}
    }
  }, []);

  // Helper to sanitize messages before persisting (avoid huge images/base64)
  function sanitizeMessages(list) {
    const trimmed = list.slice(-50); // keep last 50 messages
    return trimmed.map((m) => ({ id: m.id, role: m.role, text: m.text || "" }));
  }

  // Save chat history (safe, trimmed). Avoid storing images/data URLs.
  useEffect(() => {
    try {
      if (messages.length > 0) {
        const safe = sanitizeMessages(messages);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
        setPersistNotice("");
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e1) {
      try {
        const safer = sanitizeMessages(messages.slice(-25));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(safer));
        setPersistNotice("Chat history trimmed to fit storage limits.");
      } catch (e2) {
        setPersistNotice("Storage full: Chat history won't persist across refreshes.");
      }
    }
    scrollToBottom();
  }, [messages]);

  function scrollToBottom() {
    setTimeout(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  }

  // Mock AI response with fashion styling advice
  async function getAIResponse(prompt, hasUserImage, hasProductImage, tryonImage = null) {
    await new Promise((r) => setTimeout(r, 1200));

    if (tryonImage) {
      const score = Math.floor(Math.random() * 15 + 85);
      return `**Style Analysis Complete! 🎨**

**Overall Rating: ${score}/100**

✨ **What Works:**
- The color coordination is excellent and complements your skin tone
- The fit looks proportional and flattering
- Modern, on-trend styling

💡 **Suggestions to Elevate:**
- Consider adding a statement accessory (watch, necklace, or belt)
- Try pairing with neutral-toned footwear for balance
- A light jacket or cardigan could add dimension

🔥 **Styling Tip:** This look works great for casual outings or smart-casual events. You're pulling it off well!`;
    }

    if (hasUserImage && hasProductImage) {
      const score = Math.floor(Math.random() * 20 + 75);
      return `**Virtual Styling Analysis 👔**

**Match Score: ${score}/100**

📊 **Compatibility Check:**
- Color harmony: Excellent match!
- Style fit: The garment suits your body type well
- Occasion versatility: Perfect for casual to semi-formal settings

💎 **Pro Recommendations:**
- This pairing has great potential
- Consider accessories in complementary colors
- For a complete look, add: ${["minimalist watch", "leather belt", "casual sneakers", "structured bag"][Math.floor(Math.random() * 4)]}

🎯 **Fashion Insight:** This combination follows current trends while maintaining timeless appeal!`;
    }

    if (hasUserImage || hasProductImage) {
      return `**Image Received! 📸**

I can see your ${hasUserImage ? "photo" : "product image"}! To give you the best styling advice, please upload ${hasUserImage ? "the garment you want to try" : "a photo of yourself"} as well.

Once I have both images, I'll provide:
✅ Detailed style analysis
✅ Color coordination feedback  
✅ Fit and proportion assessment
✅ Accessory recommendations
✅ Occasion-specific styling tips`;
    }

    // Text-based responses
    const lowerPrompt = prompt.toLowerCase();

    if (lowerPrompt.includes("suggest") || lowerPrompt.includes("outfit")) {
      return `**Outfit Suggestions 🎨**

Here are some trendy combinations for you:

1️⃣ **Casual Chic:**
- Oversized white shirt + high-waisted black jeans
- White sneakers + minimal gold jewelry
- Style Score: 9/10

2️⃣ **Street Style:**
- Graphic tee + cargo pants
- Chunky sneakers + crossbody bag
- Style Score: 8.5/10

3️⃣ **Smart Casual:**
- Turtleneck sweater + tailored trousers  
- Loafers + leather watch
- Style Score: 9.5/10

Want me to analyze a specific look? Upload images or import from your try-on history!`;
    }

    if (lowerPrompt.includes("rate") || lowerPrompt.includes("score")) {
      return `To rate your look, I need to see it! You can:

📸 **Upload Images:** Share your photo + the outfit/product
📂 **Import from History:** Click "Import Try-On" to analyze previous virtual try-ons

I'll provide a detailed rating with:
- Style score (out of 100)
- Color harmony analysis
- Fit assessment
- Improvement suggestions
- Accessory recommendations`;
    }

    if (lowerPrompt.includes("color") || lowerPrompt.includes("tone")) {
      return `**Color Matching Guide 🎨**

Based on general styling principles:

🌸 **Warm Skin Tones:**
- Best: Earth tones, coral, olive, warm reds
- Avoid: Cool blues, icy pastels

❄️ **Cool Skin Tones:**  
- Best: Navy, jewel tones, pure white, cool pinks
- Avoid: Orange, warm yellows

🌟 **Neutral Skin Tones:**
- Lucky you! Most colors work well
- Experiment with both warm and cool palettes

For personalized advice, upload your photo!`;
    }

    if (lowerPrompt.includes("trend") || lowerPrompt.includes("fashion")) {
      return `**Current Fashion Trends 2025 🔥**

1. **Quiet Luxury:** Minimalist, high-quality basics
2. **Y2K Revival:** Low-rise jeans, baby tees, bold accessories  
3. **Oversized Silhouettes:** Baggy jeans, oversized blazers
4. **Sustainable Fashion:** Thrifted and vintage pieces
5. **Monochrome Magic:** Head-to-toe single color outfits

Want to see how these trends work for you? Upload your images for personalized styling!`;
    }

    return `Hey there! I'm your AI Fashion Stylist. 👗✨

I can help you with:
🎨 **Style Ratings:** Import try-ons or upload images for detailed analysis
👔 **Outfit Suggestions:** Get personalized fashion recommendations  
🎯 **Color Matching:** Find what colors suit you best
📊 **Fit Analysis:** Check if garments complement your style

**Quick Actions:**
- Click "Import Try-On" to rate previous virtual try-ons
- Upload images to get instant fashion feedback
- Ask me anything about styling, colors, or trends!

What would you like help with today?`;
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!input.trim() && !userImage && !productImage && bulkImages.length === 0) return;

    const newMsg = {
      id: Date.now(),
      role: "user",
      text: input.trim() || (bulkImages.length > 0 ? "Please analyze these looks" : "Please analyze these images"),
      userImage: userImagePreview,
      productImage: productImagePreview,
      bulkImages: bulkPreviews && bulkPreviews.length > 0 ? [...bulkPreviews] : undefined,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    
    // Generate AI response
    setLoading(true);
    let reply = "";
    try {
      if (bulkImages.length > 0) {
        // Batch: analyze each image via Gemini and append individual results
        for (let i = 0; i < bulkImages.length; i++) {
          try {
            const analysis = await analyzeTryOnImage(bulkImages[i]);
            const botMsg = {
              id: `${Date.now()}_ai_${i}`,
              role: "assistant",
              text: analysis,
              importedTryon: bulkPreviews[i],
            };
            setMessages((prev) => [...prev, botMsg]);
          } catch (innerErr) {
            console.error("Gemini batch analysis error:", innerErr);
            const botMsg = {
              id: `${Date.now()}_ai_err_${i}`,
              role: "assistant",
              text: `Sorry, I couldn't analyze image ${i + 1}.`,
            };
            setMessages((prev) => [...prev, botMsg]);
          }
        }
      } else if (userImage && productImage) {
        // Use Gemini to analyze user + product pairing
        reply = await analyzeUserAndProduct(userImage, productImage);
        const botMsg = {
          id: Date.now() + "_ai",
          role: "assistant",
          text: reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        // Text-only or partial image: fallback to existing mock guidance
        reply = await getAIResponse(newMsg.text, !!userImage, !!productImage, null);
        const botMsg = {
          id: Date.now() + "_ai",
          role: "assistant",
          text: reply,
        };
        setMessages((prev) => [...prev, botMsg]);
      }
    } catch (err) {
      console.error("Gemini analysis error:", err);
      const botMsg = {
        id: Date.now() + "_ai_err",
        role: "assistant",
        text: "Sorry, I couldn't analyze that right now. Please try again.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setLoading(false);
    }

    // Clear uploaded images after sending
    setUserImage(null);
    setProductImage(null);
    setUserImagePreview(null);
    setProductImagePreview(null);
    setBulkImages([]);
    setBulkPreviews([]);
  }

  function handleUserImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUserImage(file);
    setUserImagePreview(URL.createObjectURL(file));
  }

  function handleProductImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductImage(file);
    setProductImagePreview(URL.createObjectURL(file));
  }

  function handleBulkUpload(e) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length === 0) return;
    const previews = files.map((f) => URL.createObjectURL(f));
    setBulkImages(files);
    setBulkPreviews(previews);
  }

  function loadTryonHistory() {
    const historyRaw = localStorage.getItem(TRYON_HISTORY_KEY);
    console.log("Loading try-on history:", historyRaw);
    if (historyRaw) {
      try {
        const parsed = JSON.parse(historyRaw);
        console.log("Parsed try-on history:", parsed);
        setTryonHistory(normalizeHistory(parsed));
      } catch (error) {
        console.error("Error parsing try-on history:", error);
        setTryonHistory([]);
      }
    } else {
      console.log("No try-on history found in localStorage");
      setTryonHistory([]);
    }
  }

  async function handleImportTryon(item) {
    setShowHistoryModal(false);

    // Add user message with imported try-on
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: "Rate this virtual try-on",
      importedTryon: item.output,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Generate AI analysis with Gemini for the imported try-on image
    setLoading(true);
    let reply = "";
    try {
      if (!item || !item.output) {
        reply = "Sorry, this item has no image to analyze.";
      } else {
        reply = await analyzeTryOnImage(item.output);
      }
    } catch (err) {
      console.error("Gemini try-on analysis error:", err);
      reply = "Sorry, I couldn't rate this try-on right now. Please try again.";
    }

    const botMsg = {
      id: Date.now() + "_ai",
      role: "assistant",
      text: reply,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  }

  const quickPrompts = [
    "Suggest an outfit for me",
    "Rate my look",
    "What colors suit me?",
    "Current fashion trends",
    "Give me styling tips",
    "Analyze my fit",
  ];

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="min-h-screen bg-black text-white flex">
        <div className="w-full max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-[20rem_1fr] gap-0">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Chat Area */}
            <div className="flex flex-col h-screen">
              {/* Chat Header */}
              <div className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold tracking-wide">AI Fashion Stylist 🎨</h1>
                    <p className="text-sm text-gray-400 mt-1">Get personalized style ratings & recommendations</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        loadTryonHistory();
                        setShowHistoryModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Import Try-On
                    </button>
                    <button
                      onClick={handleClearChat}
                      className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg font-medium transition-colors flex items-center gap-2 border border-red-500/20"
                      title="Clear chat"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0a2 2 0 012-2h4a2 2 0 012 2m-8 0h8" />
                      </svg>
                      Clear Chat
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                {persistNotice && (
                  <div className="mr-auto bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 text-xs px-3 py-2 rounded">
                    {persistNotice}
                  </div>
                )}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-20 h-20 rounded-full bg-purple-600/20 flex items-center justify-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your AI Fashion Stylist</h2>
                    <p className="text-gray-400 max-w-md mb-6">
                      Upload images, import try-ons, or ask me anything about fashion. I'll provide detailed style analysis and recommendations!
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          loadTryonHistory();
                          setShowHistoryModal(true);
                        }}
                        className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
                      >
                        Import Try-On History
                      </button>
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[75%] p-4 rounded-xl backdrop-blur-xl ${
                      msg.role === "user"
                        ? "ml-auto bg-purple-600/20 border border-purple-500/30"
                        : "mr-auto bg-white/5 border border-white/10"
                    }`}
                  >
                    {/* User uploaded images */}
                    {msg.userImage && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Your Photo:</p>
                        <img src={msg.userImage} className="rounded-lg max-h-48 object-cover" alt="User" />
                      </div>
                    )}
                    {msg.productImage && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Product Image:</p>
                        <img src={msg.productImage} className="rounded-lg max-h-48 object-cover" alt="Product" />
                      </div>
                    )}
                    {/* Imported try-on */}
                    {msg.importedTryon && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Virtual Try-On:</p>
                        <img src={msg.importedTryon} className="rounded-lg max-h-64 object-cover" alt="Try-on" />
                      </div>
                    )}
                    {/* Bulk images (user message) */}
                    {msg.bulkImages && Array.isArray(msg.bulkImages) && msg.bulkImages.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs text-gray-400 mb-2">Batch Images:</p>
                        <div className="grid grid-cols-3 gap-2">
                          {msg.bulkImages.map((src, i) => (
                            <img key={i} src={src} className="rounded-lg max-h-28 object-cover border border-white/10" alt={`Batch ${i+1}`} />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {msg.role === "assistant" ? (
                      <div className="mt-1">
                        <Markdown text={msg.text} />
                        <div className="mt-2 flex gap-2">
                          <button
                            type="button"
                            onClick={async () => {
                              try {
                                await navigator.clipboard.writeText(msg.text || "");
                              } catch {}
                            }}
                            className="text-xs px-2 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <div className="mr-auto bg-white/5 border border-white/10 p-4 rounded-xl max-w-[75%]">
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-purple-500 border-t-transparent"></div>
                      <p className="text-sm text-gray-300">Analyzing your style...</p>
                    </div>
                  </div>
                )}

                <div ref={bottomRef}></div>
              </div>

              {/* Quick Prompts */}
              <div className="px-6 py-3 border-t border-white/10 bg-white/5">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  {quickPrompts.map((p, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(p)}
                      className="px-3 py-2 bg-white/10 hover:bg-white/15 rounded-lg text-xs whitespace-nowrap transition-colors"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Upload Preview */}
              {(userImagePreview || productImagePreview || (bulkPreviews && bulkPreviews.length > 0)) && (
                <div className="px-6 py-3 border-t border-white/10 bg-white/5">
                  <div className="flex gap-3 overflow-x-auto">
                    {userImagePreview && (
                      <div className="relative">
                        <img src={userImagePreview} className="w-20 h-20 object-cover rounded-lg border border-white/10" alt="User preview" />
                        <button
                          onClick={() => {
                            setUserImage(null);
                            setUserImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-400 mt-1 text-center">Your Photo</p>
                      </div>
                    )}
                    {productImagePreview && (
                      <div className="relative">
                        <img src={productImagePreview} className="w-20 h-20 object-cover rounded-lg border border-white/10" alt="Product preview" />
                        <button
                          onClick={() => {
                            setProductImage(null);
                            setProductImagePreview(null);
                          }}
                          className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        <p className="text-xs text-gray-400 mt-1 text-center">Product</p>
                      </div>
                    )}
                    {bulkPreviews && bulkPreviews.length > 0 && (
                      <div className="flex items-center gap-2">
                        {bulkPreviews.map((src, i) => (
                          <div key={i} className="relative">
                            <img src={src} className="w-20 h-20 object-cover rounded-lg border border-white/10" alt={`Batch ${i+1}`} />
                            <button
                              onClick={() => {
                                const newFiles = [...bulkImages];
                                const newPreviews = [...bulkPreviews];
                                newFiles.splice(i, 1);
                                newPreviews.splice(i, 1);
                                setBulkImages(newFiles);
                                setBulkPreviews(newPreviews);
                              }}
                              className="absolute -top-2 -right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-4 flex items-center gap-3 border-t border-white/10 bg-black/80 backdrop-blur-xl">
                {/* Upload User Image */}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors flex items-center justify-center group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleUserImageUpload} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </label>

                {/* Upload Product Image */}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors flex items-center justify-center group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleProductImageUpload} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </label>

                {/* Text Input */}
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about outfits, colors, styling tips..."
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-gray-500 focus:outline-none focus:border-purple-500/50 transition-colors"
                />

                {/* Bulk Upload (multiple try-on images) */}
                <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-lg transition-colors flex items-center justify-center group">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleBulkUpload} />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-300 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4m-8-9v10m0-10l-3 3m3-3l3 3" />
                  </svg>
                </label>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={loading || (!input.trim() && !userImage && !productImage && bulkImages.length === 0)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Try-On History Import Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowHistoryModal(false)}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative max-w-4xl w-full max-h-[80vh] bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Import Try-On History</h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {tryonHistory.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tryonHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleImportTryon(item)}
                      className="group relative aspect-3/4 rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:scale-105"
                    >
                      <img
                        src={item.output}
                        alt="Try-on"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <span className="text-xs font-medium text-white bg-purple-600 px-2 py-1 rounded-full">
                            Score: {item.meta?.styleScore || 'N/A'}
                          </span>
                          <p className="text-xs text-white mt-2">{item.meta?.name || 'Try-On'}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <p className="text-gray-400 text-lg font-medium">No Try-On History Yet</p>
                  <p className="text-gray-500 text-sm mt-2">Generate virtual try-ons first to import them here</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
