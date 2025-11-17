import React, { useRef, useState } from "react";

const icons = {
  person: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 text-gray-500 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
      />
    </svg>
  ),
  hanger: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-10 h-10 text-gray-500 mb-4"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69a.75.75 0 01.981.981A10.501 10.501 0 0118 18a10.5 10.5 0 01-10.5-10.5c0-1.71.422-3.332 1.158-4.742a.75.75 0 01.819-.162z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.972 16.572A3 3 0 0012 18a3 3 0 002.028-1.428A9.012 9.012 0 0112 15a9.012 9.012 0 01-2.028.072zM12 9a3 3 0 100 6 3 3 0 000-6z"
      />
    </svg>
  ),
};

export default function ImageUploader({
  title,
  description,
  onImageUpload,
  onImageRemove,
  imageUrl,
  disabled,
  icon,
  showWardrobeButton = false,
  onWardrobeClick,
}) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageUpload(file);
    }
  };

  return (
    <div
      className={`relative bg-black border border-dashed border-white-700/50 rounded-2xl flex flex-col items-center justify-center text-center w-full aspect-square md:aspect-3/4 transition-all duration-300 mt-6
        ${isDragging ? "border-purple-500 scale-105" : ""} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />

      {imageUrl ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat rounded-2xl"
            style={{ backgroundImage: `url(${imageUrl})` }}
          ></div>

          <div className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center p-4">
            <h3 className="text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm text-gray-400 mt-1 mb-4">Image Added</p>

            <div className="flex gap-2">
              <button
                onClick={handleClick}
                disabled={disabled}
                className="bg-gray-700 text-white py-2 px-4 text-sm rounded-lg hover:bg-gray-600 transition-colors"
              >
                Change
              </button>

              <button
                onClick={onImageRemove}
                disabled={disabled}
                className="bg-red-800/50 text-white py-2 px-4 text-sm rounded-lg hover:bg-red-800/80 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center p-6">
          {icons[icon]}
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>

          <button
            onClick={handleClick}
            disabled={disabled}
            className="bg-gray-700 text-white py-2 px-8 rounded-lg mt-4 hover:bg-gray-600 transition-colors w-full"
          >
            Upload
          </button>
          
          {showWardrobeButton && (
            <button
              onClick={onWardrobeClick}
              disabled={disabled}
              className="bg-purple-600 text-white py-2 px-8 rounded-lg mt-3 hover:bg-purple-700 transition-colors w-full flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Select from Wardrobe
            </button>
          )}
        </div>
      )}
    </div>
  );
}
