import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { getAssistantResponse, generateTryOnImage } from "../services/geminiService";
import ImageUploader from "../components/ImageUploader";
import ChatWindow from "../components/ChatWindow";
import GeneratedImageView from "../components/GeneratedImagePreview";
import TryOnHistory from "../components/NavigationSidebar";
import CompleteTheLook from "../components/HowToUse";
import Sidebar from "../components/NavigationSidebar";
import { div } from "framer-motion/client";
import Header from "../components/Header";

export default function VirtualTryOn() {
  const navigate = useNavigate();
  const STORAGE_KEY = "trynex_history_v1";
  
  const [userPhoto, setUserPhoto] = useState(null);
  const [productImage, setProductImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);

  const [messages, setMessages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState([]);
  const [wardrobeModalTab, setWardrobeModalTab] = useState("user-wardrobe");
  const [userWardrobeItems, setUserWardrobeItems] = useState([]);
  const [catalogueItems, setCatalogueItems] = useState([]);

  const userPhotoUrl = userPhoto ? URL.createObjectURL(userPhoto) : null;
  const productImageUrl = productImage ? URL.createObjectURL(productImage) : null;

  const addMessage = useCallback((role, content) => {
    setMessages((prev) => [...prev, { role, content }]);
  }, []);

  const getBotResponse = useCallback(
    async (userMessage) => {
      setIsLoadingChat(true);
      try {
        const botResponse = await getAssistantResponse(
          messages,
          userPhoto,
          productImage,
          userMessage
        );
        addMessage("model", botResponse);
      } catch (error) {
        console.error("Error getting assistant response:", error);
        addMessage("model", "Sorry, I encountered an error. Please try again.");
      } finally {
        setIsLoadingChat(false);
      }
    },
    [messages, userPhoto, productImage, addMessage]
  );

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      getBotResponse("initial_greeting");
    }
  }, []); // run once

  // Load wardrobe items from localStorage
  useEffect(() => {
    const userWardrobe = JSON.parse(localStorage.getItem("trynex_user_wardrobe") || "[]");
    
    // Catalogue items (same as in Wardrobe.jsx)
    const catalogue = [
      { id: "cat-1", imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&q=80", category: "Dresses", score: 95 },
      { id: "cat-2", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", category: "Tops", score: 92 },
      { id: "cat-3", imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=500&q=80", category: "Dresses", score: 98 },
      { id: "cat-4", imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&q=80", category: "Tops", score: 88 },
      { id: "cat-5", imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&q=80", category: "Bottoms", score: 89 },
      { id: "cat-6", imageUrl: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80", category: "Tops", score: 90 },
      { id: "cat-7", imageUrl: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&q=80", category: "Dresses", score: 91 },
      { id: "cat-8", imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&q=80", category: "Tops", score: 94 }
    ];
    
    setUserWardrobeItems(userWardrobe);
    setCatalogueItems(catalogue);
  }, []);

  // Update wardrobeItems based on active tab
  useEffect(() => {
    setWardrobeItems(wardrobeModalTab === "user-wardrobe" ? userWardrobeItems : catalogueItems);
  }, [wardrobeModalTab, userWardrobeItems, catalogueItems]);

  const handleImageUpload = (file, type) => {
    const isUser = type === "user";

    if (isUser) setUserPhoto(file);
    else setProductImage(file);

    const nextUserPhoto = isUser ? file : userPhoto;
    const nextProductImage = !isUser ? file : productImage;

    const updatedMessages = [...messages, { role: "model", content: "" }];

    setIsLoadingChat(true);

    getAssistantResponse(updatedMessages, nextUserPhoto, nextProductImage)
      .then((botResponse) => {
        addMessage("model", botResponse);
      })
      .catch((error) => {
        console.error("Error after image upload:", error);
        addMessage("model", "Image uploaded. Something went wrong with my response.");
      })
      .finally(() => {
        setIsLoadingChat(false);
      });
  };

  const handleImageRemove = (type) => {
    if (type === "user") setUserPhoto(null);
    else setProductImage(null);
  };

  const triggerGeneration = useCallback(async () => {
    if (!userPhoto || !productImage) {
      addMessage("model", "Please upload your photo and the product image first.");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    addMessage("model", "Generating your try-on… please wait.");

    try {
      const url = await generateTryOnImage(userPhoto, productImage);
      setGeneratedImage(url);
      addMessage("model", "Here is your try-on preview.");
      
      // Save to Try-On History in localStorage
      await saveToHistory(url);
    } catch (err) {
      console.error("Generation error:", err);
      addMessage("model", "There was an error generating your try-on. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [userPhoto, productImage, addMessage]);

  const saveToHistory = async (generatedImageUrl) => {
    try {
      // Keep payload small to avoid localStorage quota issues
      const newRecord = {
        id: `tryon_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        // Do NOT store large user/product base64; Wardrobe only needs output
        output: generatedImageUrl,
        meta: {
          styleScore: Math.floor(Math.random() * 20 + 80),
          createdAt: Date.now(),
          category: "Tops",
          name: `Try-On ${new Date().toLocaleString()}`,
          feedback: "AI-generated virtual try-on",
          tags: ["virtual-tryon"],
        },
      };

      const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      let updated = [newRecord, ...existing];

      // Safe save with simple trimming if quota reached
      const trySave = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      try {
        trySave();
      } catch (e) {
        // Attempt to trim older items until it fits
        if (updated.length > 1) {
          console.warn("History too large; trimming older records...");
          while (updated.length > 1) {
            updated.pop();
            try {
              trySave();
              break;
            } catch (_) {
              continue;
            }
          }
        } else {
          throw e;
        }
      }

      console.log("Saved to Try-On History:", newRecord.id);
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  };

  // Note: no longer used for history persistence to keep storage light
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSendMessage = useCallback(
    async (message) => {
      addMessage("user", message);

      if (message.toLowerCase().includes("generate try-on")) {
        await triggerGeneration();
      } else {
        await getBotResponse(message);
      }
    },
    [addMessage, triggerGeneration, getBotResponse]
  );

  const handleGenerateClick = useCallback(() => {
    addMessage("user", "Generate Try-On");
    triggerGeneration();
  }, [addMessage, triggerGeneration]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleStartOver = () => {
    setGeneratedImage(null);
    setUserPhoto(null);
    setProductImage(null);

    addMessage(
      "model",
      "Let's start a new look. Please upload your photo and a product image."
    );
  };

  const handleSelectFromWardrobe = async (item) => {
    try {
      // Use output or imageUrl property
      const imageSrc = item.output || item.imageUrl;
      if (!imageSrc) {
        throw new Error("No image URL found");
      }

      // If it's a data URL, convert locally without fetch (avoids CORS and large fetch issues)
      let file;
      if (typeof imageSrc === "string" && imageSrc.startsWith("data:")) {
        const blob = dataUrlToBlob(imageSrc);
        file = new File([blob], `wardrobe-${item.id}.jpg`, { type: blob.type || "image/jpeg" });
      } else {
        // Fetch the image from URL and convert to File object
        const response = await fetch(imageSrc, { cache: "no-cache" });
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const blob = await response.blob();
        file = new File([blob], `wardrobe-${item.id}.jpg`, { type: blob.type || "image/jpeg" });
      }
      
      handleImageUpload(file, "product");
      setShowWardrobeModal(false);
    } catch (error) {
      console.error("Error loading wardrobe item:", error);
      addMessage("model", "Sorry, I couldn't load that item. Please try uploading manually.");
    }
  };

  function dataUrlToBlob(dataUrl) {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="min-h-screen bg-black text-gray-300 flex items-start justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-[20rem_1fr_22rem] gap-6">
          {/* LEFT HISTORY PANEL */}
          <Sidebar />
          {/* MIDDLE MAIN CONTENT */}
          <main className="flex flex-col items-center justify-center py-6 min-h-[calc(100vh-4rem)] xl:min-h-0">
            {generatedImage || isGenerating ? (
              <GeneratedImageView
                generatedImage={generatedImage}
                isLoading={isGenerating}
                onStartOver={handleStartOver}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="text-white text-3xl py-3 px-2 font-semibold">Visual  <span className="text-purple-500">Try-On</span></div>
                {/* Upload Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full items-stretch justify-center max-w-4xl">
                  <ImageUploader
                    title="Your Image"
                    description="Drag & drop or upload a photo"
                    onImageUpload={(file) => handleImageUpload(file, "user")}
                    onImageRemove={() => handleImageRemove("user")}
                    imageUrl={userPhotoUrl}
                    icon="person"
                    disabled={isGenerating}
                  />

                  <ImageUploader
                    title="Product"
                    description="Upload a garment image"
                    onImageUpload={(file) => handleImageUpload(file, "product")}
                    onImageRemove={() => handleImageRemove("product")}
                    imageUrl={productImageUrl}
                    icon="hanger"
                    disabled={isGenerating}
                    showWardrobeButton={true}
                    onWardrobeClick={() => setShowWardrobeModal(true)}
                  />
                </div>

                {/* Generate Button */}
                <button
                  onClick={handleGenerateClick}
                  disabled={!userPhoto || !productImage || isGenerating}
                  className="mt-8 bg-linear-to-r from-purple-500 to-fuchsia-500 text-white font-bold py-4 px-12 rounded-full text-lg flex items-center gap-3 shadow-[0_0_25px_rgba(192,132,252,0.4)] hover:shadow-[0_0_35px_rgba(192,132,252,0.6)] transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.5 17.25l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 13.5l.398 1.197a3.375 3.375 0 002.456 2.456l1.197.398-1.197.398a3.375 3.375 0 00-2.456 2.456z"
                    />
                  </svg>
                  Generate Try-On
                </button>
              </div>
            )}
          </main>

          {/* RIGHT SIDE PANEL */}
          <div className="xl:col-start-3">
            <CompleteTheLook
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoadingChat}
            />
          </div>
        </div>
      </div>
    </div>

    {/* Wardrobe Selection Modal */}
    {showWardrobeModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowWardrobeModal(false)}
        />
        
        <div className="relative max-w-4xl w-full max-h-[80vh] bg-gray-900 border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Select from Wardrobe</h3>
            <button
              onClick={() => setShowWardrobeModal(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Section Tabs */}
          <div className="flex gap-3 mb-6 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => setWardrobeModalTab("user-wardrobe")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                wardrobeModalTab === "user-wardrobe"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                My Wardrobe
              </div>
            </button>
            
            <button
              onClick={() => setWardrobeModalTab("catalogue")}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 ${
                wardrobeModalTab === "catalogue"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Trending Catalogue
              </div>
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {wardrobeItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wardrobeItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectFromWardrobe(item)}
                    className="group relative aspect-3/4 rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all duration-300 hover:scale-105"
                  >
                    <img
                      src={item.output || item.imageUrl}
                      alt={item.meta?.category || item.category || "Wardrobe item"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        {(item.meta?.category || item.category) && (
                          <span className="text-xs font-medium text-white bg-purple-600 px-2 py-1 rounded-full">
                            {item.meta?.category || item.category}
                          </span>
                        )}
                        {(item.meta?.styleScore || item.score) && (
                          <div className="mt-2 text-sm text-white font-semibold">
                            Score: {item.meta?.styleScore || item.score}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-gray-400 text-lg font-medium">Your wardrobe is empty</p>
                <p className="text-gray-500 text-sm mt-2">Add items to your wardrobe to select them here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
