import React from "react";

const loadingMessages = [
  "Stitching the perfect look...",
  "Applying virtual threads...",
  "Tailoring pixels...",
  "Generating your style...",
  "Almost ready for the runway...",
];

export default function GeneratedImageView({ generatedImage, isLoading, onStartOver }) {
  const [currentMessage, setCurrentMessage] = React.useState(loadingMessages[0]);

  React.useEffect(() => {
    if (isLoading) {
      const intervalId = setInterval(() => {
        setCurrentMessage((prevMessage) => {
          const currentIndex = loadingMessages.indexOf(prevMessage);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);

      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  return (
    <div className="bg-[#252836] border border-gray-700/50 p-4 sm:p-6 rounded-2xl shadow-lg flex flex-col h-full w-full max-w-2xl">
      <h3 className="text-xl font-bold text-white mb-4">Your Try-On</h3>

      <div className="grow bg-[#1F1D2B] rounded-lg flex items-center justify-center relative overflow-hidden aspect-4/5">
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-10 p-4 text-center">
            <svg
              className="animate-spin h-10 w-10 text-purple-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>

            <p className="text-gray-300 mt-4 text-lg font-medium">{currentMessage}</p>
          </div>
        )}

        {generatedImage ? (
          <img
            src={generatedImage}
            alt="Generated try-on"
            className="h-full w-full object-contain"
          />
        ) : (
          !isLoading && (
            <div className="text-center text-gray-500">
              <p className="mt-4">Generating your result...</p>
            </div>
          )
        )}
      </div>

      {generatedImage && !isLoading && (
        <button
          onClick={onStartOver}
          className="mt-4 bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#252836] w-full transition-colors"
        >
          Start Over
        </button>
      )}
    </div>
  );
}
