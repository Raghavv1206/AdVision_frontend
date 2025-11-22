// frontend/src/pages/RegisterPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const unicornRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

  // 🌀 Initialize Unicorn background instantly (no loader)
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

  // ✨ Register Logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password1 !== password2) {
      toast.error("Passwords do not match!");
      return;
    }

    if (password1.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    const toastId = toast.loading("Creating account...");
    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/registration/",
        { email, password1, password2 }
      );

      if (response.data.access && response.data.refresh) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
        toast.success("Registration successful! Welcome!", { id: toastId });
        navigate("/app/dashboard");
      } else {
        toast.success("Registration successful! Please log in.", { id: toastId });
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error.response?.data);
      let errorMessage = "Registration failed. Please try again.";
      if (error.response?.data) {
        const err = error.response.data;
        if (err.email) errorMessage = err.email[0];
        else if (err.password1) errorMessage = err.password1[0];
        else if (err.password2) errorMessage = err.password2[0];
        else if (err.non_field_errors) errorMessage = err.non_field_errors[0];
      }
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div
      className="relative w-screen h-screen text-white flex flex-col items-center justify-center"
      style={{
        overflow: "hidden", // ✅ disables both scrollbars
        overscrollBehavior: "none",
      }}
    >
      {/* 🌀 Unicorn Studio Background */}
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
          margin: 0,
          padding: 0,
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

      {/* 🌟 Glassmorphic Register Card */}
      <div className="relative z-10 flex items-center justify-center mt-14">
        <form
          onSubmit={handleSubmit}
          className="p-6 w-[360px] rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 
                     shadow-[0_0_30px_rgba(189,168,200,0.3)]"
        >
          <h2 className="text-2xl font-semibold text-center mb-2 tracking-wide">
            Create Your Account
          </h2>
          <p className="text-center text-gray-300 mb-6 text-sm">
            Join <span className="text-[#BDA8C8] font-medium">AdVision</span> and start exploring.
          </p>

          {/* Email */}
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
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88fd8] text-white placeholder-gray-400 text-sm"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password1}
              onChange={(e) => setPassword1(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88fd8] text-white placeholder-gray-400 text-sm"
            />
            <p className="text-xs text-gray-400 mt-1">
              Must be at least 8 characters
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
              className="w-full px-3 py-2 bg-black/40 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a88fd8] text-white placeholder-gray-400 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white text-sm font-medium 
                       rounded-lg shadow-lg hover:shadow-[#a88fd8]/40 hover:scale-[1.03] transition-all duration-300"
          >
            Create Account
          </button>

          <p className="text-center mt-4 text-black text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#8a53a8] hover:text-[#9b56e6] font-medium transition-all duration-300"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
