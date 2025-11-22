import React, { useEffect, useRef, useState } from "react";

export default function UnicornBackground() {
  const unicornRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const wrapper = unicornRef.current;

    // If already loaded, skip
    if (window.UnicornStudio?.isInitialized) {
      setIsLoaded(true);
      return;
    }

    // Create the project div
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
      zIndex: "0",
    });
    wrapper.appendChild(projectDiv);

    // Load the Unicorn Studio script
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.34/dist/unicornStudio.umd.js";
    script.async = true;

    script.onload = () => {
      const wait = setInterval(() => {
        if (window.UnicornStudio?.init) {
          window.UnicornStudio.init();
          window.UnicornStudio.isInitialized = true;
          clearInterval(wait);
          setTimeout(() => setIsLoaded(true), 800);
        }
      }, 100);
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div
      ref={unicornRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        background:
          "radial-gradient(circle at 20% 30%, #1a1a1f 0%, #0d0d0f 100%)", // fallback dark theme
        overflow: "hidden",
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a88fd8]" />
          <p className="mt-4 text-gray-300 text-sm tracking-wide">
            Loading AdVision environment...
          </p>
        </div>
      )}
    </div>
  );
}
