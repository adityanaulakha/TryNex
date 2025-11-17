import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from "lucide-react";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendPasswordResetEmail } from "firebase/auth";
import { useAuth } from "../context/AuthContext.jsx";

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [info, setInfo] = useState(null);

  const { isLoggedIn } = useAuth();

  // If already logged in, redirect away from auth to virtual-tryon
  useEffect(() => {
    if (isLoggedIn) {
      navigate("/virtual-tryon", { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ email: "", password: "", name: "" });
    setError(null);
    setInfo(null);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      if (isSignUp) {
        if (!formData.email || !formData.password || !formData.name) {
          throw new Error("All fields required.");
        }
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        setUserEmail(cred.user.email);
        navigate("/virtual-tryon");
      } else {
        if (!formData.email || !formData.password) {
          throw new Error("Email & password required.");
        }
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        setUserEmail(cred.user.email);
        navigate("/virtual-tryon");
      }
      setFormData({ email: "", password: "", name: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError(null);
    setInfo(null);
    if (!formData.email) {
      setError("Please enter your email to reset your password.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, formData.email);
      setInfo("Password reset email sent. Please check your inbox/spam.");
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/invalid-email") setError("Invalid email address.");
      else if (code === "auth/user-not-found") setError("No account found with this email.");
      else setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      setUserEmail(cred.user.email);
      navigate("/virtual-tryon");
    } catch (err) {
      // Don't show error for user-initiated cancellation
      if (err?.code === "auth/popup-closed-by-user" || err?.code === "auth/cancelled-popup-request") {
        // Silent - user chose to cancel
      } else if (err?.code === "auth/popup-blocked") {
        setError("Popup blocked. Please allow popups and try again.");
      } else {
        setError(err.message || "Google sign-in failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-black text-white relative">
      
      {/* Back Button - Top Left */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg transition-all duration-200 group"
      >
        <ArrowLeft className="w-5 h-5 text-white group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-white font-medium">Back</span>
      </button>

      {/* Left Image Section */}
      <div className="hidden md:flex w-1/2 bg-[#0d0d0d] items-center justify-center ">
        <img
          src="https://imgs.search.brave.com/4AN7FPr_K0R-eA_ec6sv_RimDsO1hDFbvegXKnil2PY/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9jZG5p/Lmljb25zY291dC5j/b20vaWxsdXN0cmF0/aW9uL3ByZW1pdW0v/dGh1bWIvdXNlci1s/b2dpbi1lcnJvci1p/bGx1c3RyYXRpb24t/c3ZnLWRvd25sb2Fk/LXBuZy0zNzg0MTky/LnBuZw"
          alt="illustration"
          className="w-[550px] opacity-90"
        />
      </div>

      {/* Right Form Section */}
      <div className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20">
        <div className="max-w-md w-full mx-auto">
          {/* Heading */}
          <h2 className="text-4xl font-bold mb-3 text-white">
            {userEmail ? "Authenticated" : (isSignUp ? "Create Your Account" : "Welcome Back")}
          </h2>
          <p className="text-gray-400 mb-8">
            {userEmail
              ? `Signed in as ${userEmail}`
              : isSignUp
                ? "Join TryNex and start your virtual try-on experience."
                : "Sign in to continue your AI-powered try-on journey."}
          </p>

          {error && (
            <div className="mb-4 text-sm bg-red-600/20 border border-red-500 text-red-300 px-3 py-2 rounded">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 text-sm bg-green-600/20 border border-green-500 text-green-300 px-3 py-2 rounded">
              {info}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && !userEmail && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {!userEmail && (
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-2 bg-[#0f0f0f] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {!userEmail && (
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-blue-400 w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 bg-[#0f0f0f] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-blue-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            )}

            {/* Forgot password (Sign In only) */}
            {!isSignUp && !userEmail && (
              <div className="flex justify-end -mt-2">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleResetPassword}
                  className="text-xs text-blue-400 hover:text-blue-300 underline underline-offset-2"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {!userEmail && (
              <button
                type="submit"
                disabled={loading}
                className="w-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/60 transition text-white py-2 rounded-md shadow-md flex items-center justify-center gap-2"
              >
                <Lock size={18} /> {loading ? "Processing..." : (isSignUp ? "Sign Up" : "Sign In")}
              </button>
            )}
          </form>

          {!userEmail && (
            <div className="mt-4">
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full text-sm font-medium bg-white hover:bg-gray-50 disabled:bg-gray-200 text-gray-700 py-3 rounded-md border border-gray-300 flex items-center justify-center gap-3 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.64 9.2045C17.64 8.5663 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.2045Z" fill="#4285F4"/>
                  <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                  <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                  <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
                </svg>
                {loading ? "Opening..." : "Sign in with Google"}
              </button>
            </div>
          )}

          {!userEmail && (
            <p className="text-center mt-6 text-blue-400">
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <span
                onClick={toggleMode}
                className="text-white font-medium cursor-pointer hover:underline"
              >
                {isSignUp ? "Sign In here" : "Sign Up here"}
              </span>
            </p>
          )}
          {userEmail && (
            <p className="text-center mt-6 text-green-400 text-sm">You are signed in. Refresh or navigate to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
