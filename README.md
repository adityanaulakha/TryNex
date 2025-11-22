# TryNex

**AI-powered virtual try-on, styling assistant & wardrobe management — all in one modern web experience.**

<div align="center">
  <!-- <img src="public/favicon.svg" height="90" />
  <br /> -->
  Built with React + Vite · Firebase Auth · Google Gemini · Modern UI components
</div>

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Highlights](#highlights)
3. [Live Demo](#live-demo)
4. [Tech & Architecture](#tech--architecture)
5. [Screens & Components](#screens--components)
6. [Getting Started](#getting-started)
7. [Environment Variables](#environment-variables)
8. [Scripts](#scripts)
9. [Project Layout](#project-layout)
10. [Deployment (Vercel)](#deployment-vercel)
11. [Roadmap](#roadmap)
12. [Contributing](#contributing)
13. [License](#license)

---

## 🧩 Overview

TryNex helps users visualize outfits, manage wardrobes, chat with an AI stylist, and experiment with AR/overlay prototypes. The project focuses on modern UI, extremely fast development cycles (Vite), and AI-first workflows powered by Google Gemini.

---

## ✨ Highlights

* **Virtual Try-On (prototype):** Upload photos, overlay garments, preview looks.
* **AI Styling Assistant:** Chat-based stylist recommendations powered by Gemini.
* **Wardrobe Manager:** Add, organize, and tag your clothing items.
* **Tiered Plans:** Paid/unlocked features integrated with a pricing page.
* **Protected Routes:** Firebase Auth to restrict premium and personal screens.

---

## 🌐 Live Demo

Link: https://trynex.vercel.app/

---

## 🏗️ Tech & Architecture

### Tech Stack

* **React 18 + Vite** — SPA + fast dev server
* **CSS Modules / Global CSS** — Clean styling
* **Auth & Storage:** Firebase Authentication, Storage, Firestore
* **AI:** Google Gemini (via `geminiService.js`)
* **Hosting:** Vercel (recommended)
* **Linting:** ESLint & Prettier

### Architecture Notes

* SPA with client-side routing
* Serverless integrations using Firebase
* Media uploads stored in Firebase Storage
* Gemini-powered styling & AI chat flows

---

## 🖼️ Screens & Components

### Pages

* Home (`HomePages.jsx`)
* Authentication (`Auth.jsx`)
* AI Chat Assistant (`AIChatAssistant.jsx`)
* Virtual Try-On (`VirtualTryOn.jsx`)
* Wardrobe Manager (`Wardrobe.jsx`)
* Pricing (`PricingPage.jsx`)
* About & Contact pages

### Core Components

* `NavBar`, `NavigationSidebar`
* `HeroSection`, `HowItWorks`, `KeyFeatures`
* `ChatWindow`, `GeneratedImagePreview`, `ImageUploader`
* `ProtectedRoute`

---

## 🚀 Getting Started

### Prerequisites

* Node.js **>= 18**
* Firebase Project
* Gemini API Key

### Installation

```bash
git clone https://github.com/adityanaulakha/TryNex.git
cd TryNex
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

---

## 🔐 Environment Variables

Create a `.env` file:

```bash
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

> Access with `import.meta.env.VITE_*`.

---

## 📜 Scripts

| Command           | Description      |
| ----------------- | ---------------- |
| `npm run dev`     | Start dev server |
| `npm run build`   | Production build |
| `npm run preview` | Preview build    |
| `npm run lint`    | Run ESLint       |

---

## 📁 Project Layout

```
src/
  assets/
  components/
  context/
  pages/
  services/
  App.jsx
  main.jsx
```

---

## 🌍 Deployment (Vercel)

1. Import repo to Vercel
2. Add env variables in Vercel dashboard
3. Build Command: `npm run build`
4. Output: `dist`
5. (Optional) Use serverless functions for Gemini proxy requests

---

## 🛣️ Roadmap

* [ ] Garment segmentation
* [ ] Outfit scoring
* [ ] Cloud image storage optimization
* [ ] Mobile gestures
* [ ] Accessibility upgrades
* [ ] Analytics dashboard

---

## 🤝 Contributing

1. Fork repo
2. Create branch: `feature/your-feature`
3. Commit changes
4. Push & create PR

---