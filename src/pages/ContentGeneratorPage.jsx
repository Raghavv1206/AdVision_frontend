// frontend/src/pages/ContentGeneratorPage.jsx — AdVision Dark Redesign (Responsive Upgrade)
import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  Sparkles,
  Image as ImageIcon,
  Copy,
  CheckCircle,
  Eye,
  Download,
  Wand2,
} from "lucide-react";

export default function ContentGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [tone, setTone] = useState("persuasive");
  const [platform, setPlatform] = useState("instagram");
  const [style, setStyle] = useState("professional");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [variations, setVariations] = useState(3);

  const [adTemplate, setAdTemplate] = useState("modern");
  const [includeText, setIncludeText] = useState(true);
  const [headline, setHeadline] = useState("");
  const [tagline, setTagline] = useState("");
  const [ctaText, setCtaText] = useState("Learn More");

  const [generatedTexts, setGeneratedTexts] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoadingText, setIsLoadingText] = useState(false);
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  // 🔥 Track saving state per image
  const [isSavingImage, setIsSavingImage] = useState(false);
  const [savingIndex, setSavingIndex] = useState(null);

  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [activeTab, setActiveTab] = useState("text");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.get("/campaigns/");
        setCampaigns(response.data);
        if (response.data.length > 0) {
          setSelectedCampaign(response.data[0].id);
        }
      } catch {
        toast.error("Could not fetch your campaigns.");
      }
    };
    fetchCampaigns();
  }, []);

  const handleGenerateText = async () => {
    if (!prompt.trim()) return toast.error("Please enter a prompt.");
    if (!selectedCampaign) return toast.error("Please select a campaign.");

    setIsLoadingText(true);
    setGeneratedTexts([]);
    const toastId = toast.loading("Generating ad copy with DeepSeek AI...");

    try {
      const res = await apiClient.post("/generate/text/", {
        prompt: prompt.trim(),
        tone,
        platform,
        campaign_id: selectedCampaign,
        variations,
      });

      if (res.data.saved_ads?.length) {
        setGeneratedTexts(res.data.saved_ads);
        toast.success(
          `Generated ${res.data.saved_ads.length} variations!`,
          { id: toastId }
        );
      } else {
        setGeneratedTexts([{ text: res.data.generated_text }]);
        toast.success("Ad copy generated!", { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to generate text.",
        { id: toastId }
      );
    } finally {
      setIsLoadingText(false);
    }
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return toast.error("Please enter an image description.");
    if (!selectedCampaign) return toast.error("Please select a campaign.");

    setIsLoadingImage(true);
    setGeneratedImages([]);
    setSelectedImage(null);
    const toastId = toast.loading("Generating images from multiple AIs...");

    try {
      const res = await apiClient.post("/generate/image/", {
        prompt: prompt.trim(),
        campaign_id: selectedCampaign,
        style,
        aspect_ratio: aspectRatio,
        ad_template: adTemplate,
        include_text: includeText,
        headline,
        tagline,
        cta_text: ctaText,
        generate_both: true,
      });

      if (res.data.images?.length) {
        setGeneratedImages(res.data.images);
        toast.success(
          `Generated ${res.data.images.length} images!`,
          { id: toastId }
        );
      } else toast.error("No images were generated.", { id: toastId });
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
        "Failed to generate images.",
        { id: toastId }
      );
    } finally {
      setIsLoadingImage(false);
    }
  };

  // 🟣 Updated save function → unique save index per image
  const handleSaveImage = async (imageData, provider, imagePrompt, index) => {
    setIsSavingImage(true);
    setSavingIndex(index); // Track which image is saving
    const toastId = toast.loading("Saving image to cloud...");

    try {
      const res = await apiClient.post("/generate/image/save/", {
        campaign_id: selectedCampaign,
        image_data: imageData,
        provider,
        prompt: imagePrompt,
      });

      toast.success("Image saved to Cloudinary!", { id: toastId });
      setSelectedImage(res.data);
    } catch {
      toast.error("Failed to save image.", { id: toastId });
    } finally {
      setIsSavingImage(false);
      setSavingIndex(null);
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const templateExamples = {
    modern: "Dark gradient overlay with centered CTA",
    minimal: "Clean white space at top with elegant typography",
    bold: "Vibrant colored banner with bold text",
    gradient: "Full gradient overlay and central focus",
  };

  const styleExamples = {
    professional: "Studio-quality product photography",
    creative: "Artistic and visually unique",
    minimal: "Clean and modern",
    vintage: "Retro or classic aesthetics",
    lifestyle: "Realistic and emotional imagery",
    luxury: "Premium and sophisticated visuals",
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <Wand2 className="w-7 h-7 text-[#a88fd8]" /> AI Content Generator
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            Create professional ad copy & visuals powered by DeepSeek & Stability AI
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 mb-8 border-b border-[#2a2235] overflow-x-auto no-scrollbar">
        {[
          { id: "text", label: "Ad Copy Generator" },
          { id: "image", label: "Ad Image Generator" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-4 font-medium whitespace-nowrap ${activeTab === tab.id
              ? "text-[#a88fd8] border-b-2 border-[#a88fd8]"
              : "text-gray-400 hover:text-gray-200"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Configuration Panel */}
        <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6 space-y-5">

          {/* Campaign */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Campaign</label>
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          {/* TEXT GENERATOR PANEL */}
          {activeTab === "text" ? (
            <>
              <div>
                <label className="block text-sm text-gray-300 mb-2">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  <option value="persuasive">Persuasive</option>
                  <option value="witty">Witty</option>
                  <option value="formal">Formal</option>
                  <option value="casual">Casual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Variations</label>
                <select
                  value={variations}
                  onChange={(e) => setVariations(parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  <option value="1">1 Variation</option>
                  <option value="3">3 Variations</option>
                  <option value="5">5 Variations</option>
                </select>
              </div>
            </>
          ) : (
            <>
              {/* IMAGE PANEL */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Image Style
                  <span className="block text-xs text-gray-500">
                    {styleExamples[style]}
                  </span>
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  {Object.keys(styleExamples).map((key) => (
                    <option key={key} value={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Aspect Ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  <option value="1:1">1:1 Square</option>
                  <option value="16:9">16:9 Landscape</option>
                  <option value="9:16">9:16 Portrait</option>
                  <option value="4:5">4:5 Feed</option>
                </select>
              </div>

              {/* Ad Template */}
              <div className="border-t border-[#2a2235] pt-4 mt-4">
                <h3 className="text-[#a88fd8] font-semibold mb-3">Ad Template</h3>
                <select
                  value={adTemplate}
                  onChange={(e) => setAdTemplate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                  <option value="bold">Bold</option>
                  <option value="gradient">Gradient</option>
                </select>

                <p className="text-xs text-gray-400 mt-1">
                  {templateExamples[adTemplate]}
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeText}
                    onChange={(e) => setIncludeText(e.target.checked)}
                    className="w-4 h-4 text-[#a88fd8]"
                  />
                  <label className="text-sm text-gray-300">
                    Include Text Overlay
                  </label>
                </div>

                {includeText && (
                  <div className="space-y-4 mt-4">

                    <div>
                      <label className="block text-sm text-[#a88fd8] mb-1">Headline</label>
                      <input
                        type="text"
                        value={headline}
                        onChange={(e) => setHeadline(e.target.value)}
                        placeholder="Add headline..."
                        className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
                        rounded-lg text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#a88fd8] mb-1">Tagline</label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="Add tagline..."
                        className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
                        rounded-lg text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#a88fd8] mb-1">CTA Button</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        placeholder="Enter CTA text"
                        className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
                        rounded-lg text-white text-sm"
                      />
                    </div>

                  </div>
                )}

              </div>
            </>
          )}
        </div>

        {/* Prompt + Results */}
        <div className="lg:col-span-2 space-y-6">

          {/* Prompt Box */}
          <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6">
            <label className="block text-sm text-gray-300 mb-2">
              {activeTab === "text" ? "Ad Copy Prompt" : "Image Description"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white p-3"
              placeholder={
                activeTab === "text"
                  ? "Describe your product or service..."
                  : "Describe what you want in the image..."
              }
            />
            <button
              onClick={activeTab === "text" ? handleGenerateText : handleGenerateImage}
              disabled={isLoadingText || isLoadingImage}
              className={`mt-4 w-full py-3 rounded-lg font-semibold transition-all shadow-md ${activeTab === "text"
                ? "bg-gradient-to-r from-blue-600 to-blue-800 hover:brightness-110"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:brightness-110"
                }`}
            >
              {isLoadingText || isLoadingImage
                ? "Generating..."
                : activeTab === "text"
                  ? "Generate Ad Copy"
                  : "Generate Ad Images"}
            </button>
          </div>

          {/* Generated Text Results */}
          {activeTab === "text" && generatedTexts.length > 0 && (
            <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#a88fd8] mb-4">
                Generated Ad Copy
              </h3>

              <div className="space-y-4">
                {generatedTexts.map((ad, i) => (
                  <div
                    key={i}
                    className="p-4 bg-[#0f0c12] rounded-lg border border-[#2a2235] hover:border-[#a88fd8]/40 transition"
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-[#a88fd8]">
                        Variation {i + 1}
                      </span>
                      <button
                        onClick={() => handleCopyText(ad.text)}
                        className="text-gray-400 hover:text-white flex items-center gap-1 text-sm"
                      >
                        <Copy className="w-4 h-4" /> Copy
                      </button>
                    </div>

                    <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                      {ad.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generated Image Results */}
          {activeTab === "image" && generatedImages.length > 0 && (
            <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-[#a88fd8] mb-4">
                Generated Ad Images
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {generatedImages.map((img, i) => (
                  <div
                    key={i}
                    className={`rounded-xl overflow-hidden border ${selectedImage?.provider === img.provider
                        ? "border-green-500 shadow-lg"
                        : "border-[#2a2235] hover:border-[#a88fd8]/40"
                      }`}
                  >

                    {/* AI Provider Label */}
                    <div className="bg-black/40 text-xs text-gray-300 p-2 text-center border-b border-[#2a2235]">
                      Generated by: <span className="text-[#a88fd8] font-medium">
                        {img.provider?.replace("_", " ").toUpperCase() || "AI Engine"}
                      </span>
                    </div>

                    {/* Image */}
                    <img
                      src={img.image_data}
                      className="w-full h-64 object-cover"
                      alt="Generated AI"
                    />

                    {/* Save Button */}
                    <button
                      onClick={() =>
                        handleSaveImage(img.image_data, img.provider, prompt, i)
                      }
                      disabled={isSavingImage && savingIndex === i}
                      className="w-full py-2 mt-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white rounded-md hover:brightness-110"
                    >
                      {isSavingImage && savingIndex === i ? "Saving..." : "Save Image"}
                    </button>

                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
