import { Routes, Route } from "react-router-dom";
import HomePages from "./pages/HomePages";
import Auth from "./pages/Auth";
import AboutPage from "./pages/AboutPage";
import PricingPage from "./pages/PricingPage";
import ContactPage from "./pages/ContactPage";
import VirtualTryOn from "./pages/VirtualTryOn";
import Wardrobe from "./pages/Wardrobe";
import AiChatStyler from "./pages/AiChatStyler";
import ArVision from "./pages/ArVision";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePages />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/virtual-tryon"
        element={
          <ProtectedRoute>
            <VirtualTryOn />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wardrobe"
        element={
          <ProtectedRoute>
            <Wardrobe />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-chat-styler"
        element={
          <ProtectedRoute>
            <AiChatStyler />
          </ProtectedRoute>
        }
      />
      <Route
        path="/webar"
        element={
          <ProtectedRoute>
            <ArVision />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
