// frontend/src/pages/LoginPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import GoogleLoginButton from "../components/GoogleLoginButton";

export default function LoginPage() {
  const unicornRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 🌀 Initialize Unicorn background (no loader)
  useEffect(() => {
    const wrapper = unicornRef.current;
    if (wrapper && !wrapper.querySelector("[data-us-project]")) {
      const projectDiv = document.createElement("div");
      projectDiv.setAttribute("data-us-project", "p4VdxnnHjOL82ic0CzsJ");
      Object.assign(projectDiv.style, {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        margin: "0",
        padding: "0",
      });
      wrapper.appendChild(projectDiv);

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src =
        "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";

      script.onload = () => {
        if (!window.UnicornStudio?.isInitialized) {
          window.UnicornStudio = { isInitialized: true };
          window.UnicornStudio.init?.();
        }
      };

      (document.head || document.body).appendChild(script);
    }
  }, []);

  // ✨ Login Logic
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");

    try {
      const response = await apiClient.post("/auth/login/", { email, password });
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);

      toast.success("Logged in successfully!", { id: toastId });
      navigate("/app/dashboard");
    } catch (error) {
      console.error("Login error:", error.response?.data);
      let errorMessage = "Login failed. Please check your credentials.";

      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.non_field_errors)
          errorMessage = errorData.non_field_errors[0];
        else if (errorData.detail) errorMessage = errorData.detail;
        else if (errorData.email) errorMessage = errorData.email[0];
        else if (errorData.password) errorMessage = errorData.password[0];
      }

      toast.error(errorMessage, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center h-screen w-screen text-white"
      style={{
        overflow: "hidden",
      }}
    >
      {/* 🌀 Unicorn Background */}
      <div
        ref={unicornRef}
        className="absolute inset-0 w-full h-full"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          zIndex: 0,
        }}
      ></div>

      {/* 🌐 Navbar */}
      <header
        className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-9 py-3
                   bg-transparent hover:bg-black/50 backdrop-blur-[3px] border-b border-white/10 
                   transition-all duration-500 ease-in-out"
      >
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/advisionlogo.png"
            alt="AdVision Logo"
            className="h-9 w-auto drop-shadow-[0_2px_6px_rgba(255,255,255,0.2)] transition-all duration-300 hover:scale-105"
          />
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm text-white/90 hover:text-[#BDA8C8] transition-all duration-300 relative 
                       after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-[#BDA8C8] 
                       hover:after:w-full after:transition-all after:duration-300"
          >
            Home
          </Link>
        </nav>
      </header>

      {/* 🌟 Glassmorphic Login Card */}
      <div className="relative z-10 flex items-center justify-center h-screen">
        <div
          className="p-6 w-[340px] rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                     shadow-[0_0_30px_rgba(189,168,200,0.3)] mt-10"
        >
          <h2 className="text-2xl font-semibold text-center mb-2 tracking-wide">
            Welcome Back
          </h2>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Log in to your{" "}
            <span className="text-[#BDA8C8] font-medium">AdVision</span> account
          </p>

          {/* Google Login */}
          <div className="mb-5">
            <GoogleLoginButton />
          </div>

          {/* Divider */}
          <div className="flex items-center mb-5">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-3 text-gray-400 text-xs">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88fd8] text-white placeholder-gray-400 text-sm"
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={isLoading}
                className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88fd8] text-white placeholder-gray-400 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white text-sm font-medium 
                         rounded-lg shadow-lg hover:shadow-[#a88fd8]/40 hover:scale-[1.03] transition-all duration-300 
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login with Email"}
            </button>
          </form>

          <p className="text-center mt-4 text-black text-sm">
            No account?{" "}
            <Link
              to="/register"
              className="text-[#8a53a8] hover:text-[#9b56e6] font-medium transition-all duration-300"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
