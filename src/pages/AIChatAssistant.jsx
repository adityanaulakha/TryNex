import React, { useState, useEffect, useRef } from "react";

export default function AIChatAssistant() {
  const STORAGE_KEY = "trynex_chat_history_v1";

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [uploadPreview, setUploadPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  // Load chat history
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setMessages(parsed);
      } catch {}
    }
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  // mock AI response
  async function mockAIResponse(prompt, image) {
    await new Promise((r) => setTimeout(r, 900));

    if (image) {
      return `This outfit looks clean! The silhouette works well with your proportions. I’d recommend pairing it with neutral sneakers or a minimal accessory for balance.`;
    }

    if (/suggest/i.test(prompt)) {
      return "Try a pastel oversized sweatshirt with tapered black cargos and white sneakers — it’s comfy, symmetric, and visually balanced.";
    }
    if (/rate/i.test(prompt)) {
      return "I’d rate this look **8/10** — clean, trendy, and easy to style for casual meets.";
    }
    if (/mix/i.test(prompt)) {
      return "Try mixing this with dark jeans, a plain tee, and a lightweight jacket — minimal yet aesthetic.";
    }

    return "Got it! Your stylist is here — ask anything about outfits, looks, combinations, or style rating.";
  }

  function scrollToBottom() {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }

  function handleInputSubmit(e) {
    e.preventDefault();
    if (!input.trim() && !imageFile) return;

    const newMsg = {
      id: Date.now(),
      role: "user",
      text: input.trim(),
      image: uploadPreview,
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setUploadPreview(null);
    setImageFile(null);

    generateAIResponse(newMsg.text, newMsg.image);
  }

  async function generateAIResponse(text, img) {
    setLoading(true);
    const reply = await mockAIResponse(text, img);

    const botMsg = {
      id: Date.now() + "_a",
      role: "assistant",
      text: reply,
      image: null,
    };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  }

  function handleImageUpload(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setUploadPreview(URL.createObjectURL(f));
  }

  const quickPrompts = [
    "Suggest an outfit for me",
    "Rate my look",
    "Mix & Match suggestions",
    "What suits my skin tone?",
    "Give me a minimal aesthetic fit",
    "How can I improve this outfit?",
  ];

  return (
    <div className="min-h-screen bg-[#07070A] text-white flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-xl flex justify-between items-center">
        <h1 className="text-lg font-semibold tracking-wide">AI Fashion Stylist</h1>
        <span className="text-xs bg-white/10 px-2 py-1 rounded">Beta</span>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[70%] p-4 rounded-xl backdrop-blur-xl ${
              msg.role === "user"
                ? "ml-auto bg-indigo-600/20 border border-indigo-500/20"
                : "mr-auto bg-white/5 border border-white/10"
            }`}
          >
            {msg.image && (
              <div className="mb-3">
                <img
                  src={msg.image}
                  className="rounded-lg max-h-56 object-cover"
                />
              </div>
            )}
            <p className="text-sm leading-relaxed whitespace-pre-line">{msg.text}</p>
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-white/5 border border-white/10 p-4 rounded-xl max-w-[70%]">
            <p className="text-sm text-gray-300">Thinking...</p>
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      {/* Quick Prompts */}
      <div className="px-6 py-4 border-t border-white/10 bg-white/5 backdrop-blur-xl">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickPrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setInput(p);
              }}
              className="px-3 py-2 bg-white/10 rounded-lg text-xs whitespace-nowrap hover:bg-white/20 transition"
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleInputSubmit}
        className="p-4 flex items-center gap-3 border-t border-white/10 bg-[#0B0F1A]/80 backdrop-blur-xl"
      >
        {/* Upload button */}
        <label className="cursor-pointer bg-white/5 hover:bg-white/10 p-3 rounded-lg transition flex items-center justify-center">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 0l-3 3m3-3l3 3m3 5v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2m14-2l-3-3m3 3l-3 3" />
          </svg>
        </label>

        {uploadPreview && (
          <div className="relative">
            <img
              src={uploadPreview}
              className="w-14 h-14 object-cover rounded-lg border border-white/10"
            />
            <button
              type="button"
              onClick={() => {
                setUploadPreview(null);
                setImageFile(null);
              }}
              className="absolute top-0 right-0 bg-black/60 text-white text-xs rounded-full px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Input field */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about outfits, colours, looks..."
          className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-gray-400 focus:outline-none"
        />

        {/* Send */}
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
