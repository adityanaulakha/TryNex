import { GoogleGenAI, Modality } from "@google/genai";

if (!import.meta.env.VITE_GEMINI_API_KEY) {
  throw new Error("VITE_GEMINI_API_KEY is not set in .env");
}

const ai = new GoogleGenAI({
  apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

// Simple sleep helper
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Determine if an error is transient/overload (retryable)
function isRetryableError(err) {
  const status = err?.error?.status || err?.status;
  const code = err?.error?.code || err?.code;
  const msg = (err?.message || "").toLowerCase();
  return (
    status === "UNAVAILABLE" ||
    code === 503 ||
    code === 429 ||
    msg.includes("overloaded") ||
    msg.includes("temporarily unavailable") ||
    msg.includes("quota")
  );
}

// Retry wrapper with exponential backoff and jitter
async function callWithRetry(fn, { retries = 3, baseDelay = 800, maxDelay = 4000 } = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;
      if (attempt > retries || !isRetryableError(err)) {
        throw err;
      }
      const delay = Math.min(maxDelay, baseDelay * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250);
      await sleep(delay);
    }
  }
}

/** Convert file → inlineData for Gemini */
const fileToGenerativePart = async (file) => {
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(file);
  });

  return {
    inlineData: {
      data: base64,
      mimeType: file.type,
    },
  };
};

/** Convert data URL (or fetch by URL) → inlineData for Gemini */
const imageSrcToGenerativePart = async (src) => {
  if (typeof src !== "string") {
    throw new Error("imageSrcToGenerativePart: src must be a string");
  }
  if (src.startsWith("data:")) {
    const [meta, data] = src.split(",");
    const mimeMatch = /^data:([^;]+);base64$/.exec(meta);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/png";
    return {
      inlineData: {
        data,
        mimeType,
      },
    };
  }

  // Fallback: fetch remote URL and convert to base64
  const resp = await fetch(src);
  const blob = await resp.blob();
  const base64 = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
  return {
    inlineData: {
      data: base64,
      mimeType: blob.type || "image/jpeg",
    },
  };
};

/** Generate Try-On Image (REAL Gemini 2.5 Flash Image API) */
export const generateTryOnImage = async (userPhoto, productImage) => {
  const userPhotoPart = await fileToGenerativePart(userPhoto);
  const productPhotoPart = await fileToGenerativePart(productImage);

  const prompt =
    "Act as a virtual stylist. Take the clothing item from the second image and realistically place it on the person in the first image. Pay attention to fit, lighting, and shadows to create a seamless and believable virtual try-on photo.";

  const response = await callWithRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [userPhotoPart, productPhotoPart, { text: prompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    })
  );

  const firstPart =
    response.candidates?.[0]?.content?.parts?.[0];

  if (
    firstPart &&
    firstPart.inlineData &&
    firstPart.inlineData.data
  ) {
    const base64 = firstPart.inlineData.data;
    const mime = firstPart.inlineData.mimeType;
    return `data:${mime};base64,${base64}`;
  }

  throw new Error("Could not generate image from Gemini response.");
};

/** SYSTEM INSTRUCTIONS for AI Assistant */
const assistantSystemInstruction = `
You are TryNex Basic Try-On Assistant, an AI helper for a virtual try-on app.

Your ONLY responsibilities are:
- Tell users to upload their photo.
- Tell users to upload the product image.
- When both are uploaded, say: "Ready to generate try-on."
- When the try-on is generated, say: "Here is your try-on preview."

STRICT RULES:
- NO fashion analysis.
- NO style tips.
- NO opinions.
- NO technical details.
- ONLY guide the try-on process.
`;

/** Chat Response Generator */
export const getAssistantResponse = async (
  history,
  userPhoto,
  productImage,
  userMessage
) => {
  let currentPrompt = "";

  if (userMessage === "initial_greeting") {
    currentPrompt =
      "The user just opened the app. Greet them and tell them the first step.";
  } else {
    currentPrompt = userMessage
      ? `The user says: "${userMessage}"`
      : "The user uploaded an image.";
  }

  const context = `
CURRENT STATE:
- User photo uploaded: ${userPhoto ? "Yes" : "No"}
- Product image uploaded: ${productImage ? "Yes" : "No"}

TASK:
Respond properly according to the strict try-on assistant rules.

USER ACTION:
${currentPrompt}
`;

  const response = await callWithRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: context,
      config: {
        systemInstruction: assistantSystemInstruction,
      },
    })
  );

  return response.text.trim();
};

/** Analyze a single try-on image and return a styled rating/feedback string */
export const analyzeTryOnImage = async (imageSrc) => {
  // Allow passing a File/Blob or a string (data URL / remote URL)
  const imagePart =
    typeof imageSrc === "string"
      ? await imageSrcToGenerativePart(imageSrc)
      : await fileToGenerativePart(imageSrc);
  const prompt = `You are a professional fashion stylist.
Given the provided try-on image, rate the overall look from 0 to 100 and provide concise feedback.
Be specific about color harmony, fit, silhouette, occasion fit, and improvements.
Return a short markdown response starting with "Overall Rating: <score>/100" followed by 3-5 bullet points of insights and 2-3 tips.`;

  try {
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [imagePart, { text: prompt }] },
      })
    );
    return response.text.trim();
  } catch (err) {
    if (isRetryableError(err)) {
      return "The styling service is temporarily busy. Please try again in a moment.";
    }
    throw err;
  }
};

/** Analyze a user photo + product image pairing and return a rating/feedback string */
export const analyzeUserAndProduct = async (userPhotoFile, productPhotoFile) => {
  const userPart = await fileToGenerativePart(userPhotoFile);
  const productPart = await fileToGenerativePart(productPhotoFile);
  const prompt = `You are a professional fashion stylist.
Analyze how well the product would work for the person in the user photo.
Provide a "Match Score: <score>/100" and discuss:
- Color compatibility
- Fit & silhouette likelihood
- Occasion suitability
Then add 2-3 concrete styling suggestions. Keep it concise in markdown.`;

  try {
    const response = await callWithRetry(() =>
      ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: { parts: [userPart, productPart, { text: prompt }] },
      })
    );
    return response.text.trim();
  } catch (err) {
    if (isRetryableError(err)) {
      return "The styling service is temporarily busy. Please try again in a moment.";
    }
    throw err;
  }
};
