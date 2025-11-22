// frontend/src/pages/ContentLibraryPage.jsx — Full CRUD Operations
import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  Copy,
  Trash2,
  FileText,
  Image as ImageIcon,
  X,
  Eye,
  Edit3,
  Save,
  Download,
  Search,
  Filter,
} from "lucide-react";

export default function ContentLibraryPage() {
  const [activeTab, setActiveTab] = useState("text");
  const [adContent, setAdContent] = useState([]);
  const [images, setImages] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingImageId, setEditingImageId] = useState(null);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [contentRes, imagesRes, campaignsRes] = await Promise.all([
        apiClient.get("/adcontent/"),
        apiClient.get("/images/"),
        apiClient.get("/campaigns/"),
      ]);

      setAdContent(contentRes.data);
      setImages(imagesRes.data);
      setCampaigns(campaignsRes.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to load content library.");
    } finally {
      setIsLoading(false);
    }
  };

  // TEXT FILTER
  const filteredAdContent = adContent.filter((ad) => {
    const matchesCampaign =
      selectedCampaign === "all" || ad.campaign === selectedCampaign;
    const matchesSearch = ad.text
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCampaign && matchesSearch;
  });

  // IMAGE FILTER
  const filteredImages = images.filter((img) => {
    const matchesCampaign =
      selectedCampaign === "all" || img.campaign === selectedCampaign;
    const matchesSearch = img.prompt
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCampaign && matchesSearch;
  });

  // Copy
  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Delete AD CONTENT
  const handleDeleteAdContent = async (id) => {
    if (!window.confirm("Delete this ad content?")) return;

    const toastId = toast.loading("Deleting...");
    try {
      await apiClient.delete(`/adcontent/${id}/`);
      toast.success("Deleted!", { id: toastId });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete.", { id: toastId });
    }
  };

  // Delete IMAGE
  const handleDeleteImage = async (id) => {
    if (!window.confirm("Delete this image from cloud?")) return;

    const toastId = toast.loading("Deleting image...");
    try {
      await apiClient.delete(`/images/${id}/delete/`);
      toast.success("Image deleted!", { id: toastId });
      fetchData();
    } catch (error) {
      toast.error("Failed to delete image.", { id: toastId });
    }
  };

  // Edit IMAGE prompt
  const handleEditImage = (img) => {
    setEditingImageId(img.id);
    setEditedPrompt(img.prompt || "");
  };

  const handleSaveImageEdit = async (imageId) => {
    if (!editedPrompt.trim()) return toast.error("Prompt cannot be empty!");

    const toastId = toast.loading("Updating...");
    try {
      await apiClient.patch(`/images/${imageId}/update/`, {
        prompt: editedPrompt,
      });

      toast.success("Updated!", { id: toastId });
      setEditingImageId(null);
      setEditedPrompt("");
      fetchData();
    } catch (error) {
      toast.error("Failed to update.", { id: toastId });
    }
  };

  const handleCancelEdit = () => {
    setEditingImageId(null);
    setEditedPrompt("");
  };

  // Download image
  const handleDownloadImage = async (imageUrl, prompt) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.href = url;
      a.download = `${prompt
        .substring(0, 30)
        .replace(/[^a-z0-9]/gi, "_")}.png`;

      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      a.remove();
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  // LOADING SCREEN
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f0c12]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a88fd8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white px-4 sm:px-6 lg:px-8 py-10">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3">
          <FileText className="w-7 h-7 text-[#a88fd8]" /> Content Library
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage all your AI-generated ad copy and visuals
        </p>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-[#16111d]/60 border border-[#2a2235] p-4 sm:p-6 rounded-2xl shadow-lg mb-8 space-y-4">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === "text"
                ? "bg-gradient-to-r from-[#a88fd8] to-[#7b5cc2] text-white shadow-lg"
                : "bg-[#0f0c12] text-gray-400 hover:text-white hover:bg-[#2a2235]"
              }`}
          >
            <FileText className="w-4 h-4" />
            Ad Copy ({filteredAdContent.length})
          </button>

          <button
            onClick={() => setActiveTab("images")}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${activeTab === "images"
                ? "bg-gradient-to-r from-[#a88fd8] to-[#7b5cc2] text-white shadow-lg"
                : "bg-[#0f0c12] text-gray-400 hover:text-white hover:bg-[#2a2235]"
              }`}
          >
            <ImageIcon className="w-4 h-4" />
            Images ({filteredImages.length})
          </button>
        </div>

        {/* Search & Filter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === "text" ? "ad copy" : "images"}...`}
              className="w-full pl-10 pr-4 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-[#a88fd8] focus:outline-none"
            />
          </div>

          {/* Campaign Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white focus:ring-2 focus:ring-[#a88fd8] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Campaigns ({campaigns.length})</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ==================== AD COPY TAB ==================== */}
      {activeTab === "text" ? (
        <div className="space-y-4">
          {filteredAdContent.length === 0 ? (
            <div className="text-center py-16 bg-[#16111d]/60 border border-[#2a2235] rounded-2xl shadow-inner">
              <FileText className="mx-auto w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400">
                {searchQuery
                  ? "No ad copy matches your search."
                  : "No ad copy found. Generate some content!"}
              </p>
            </div>
          ) : (
            filteredAdContent.map((ad) => (
              <div
                key={ad.id}
                className="bg-[#16111d]/70 border border-[#2a2235] rounded-2xl p-5 sm:p-6 hover:border-[#a88fd8]/40 transition-all shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-[#2a2235] text-[#a88fd8] text-xs rounded-full capitalize">
                      {ad.platform}
                    </span>
                    <span className="px-2 py-1 bg-[#2a2235] text-purple-300 text-xs rounded-full capitalize">
                      {ad.tone}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopyText(ad.text)}
                      title="Copy to clipboard"
                      className="p-2 text-gray-400 hover:text-white hover:bg-[#2a2235] rounded-lg transition"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteAdContent(ad.id)}
                      title="Delete"
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed mb-3">
                  {ad.text}
                </p>

                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Created: {new Date(ad.created_at).toLocaleDateString()}</span>
                  <span>
                    {ad.clicks > 0 && `${ad.clicks} clicks • `}
                    {ad.views > 0 && `${ad.views} views`}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ==================== IMAGES TAB ==================== */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredImages.length === 0 ? (
            <div className="col-span-full text-center py-16 bg-[#16111d]/60 border border-[#2a2235] rounded-2xl shadow-inner">
              <ImageIcon className="mx-auto w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400">
                {searchQuery
                  ? "No images match your search."
                  : "No images found. Generate some visuals!"}
              </p>
            </div>
          ) : (
            filteredImages.map((img) => (
              <div
                key={img.id}
                className="bg-[#16111d]/70 border border-[#2a2235] rounded-2xl overflow-hidden hover:border-[#a88fd8]/40 transition-all shadow-md group"
              >
                {/* Image Preview */}
                <div
                  className="relative cursor-pointer h-56"
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img.image_url}
                    alt={img.prompt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 flex items-center justify-center transition-all">
                    <Eye className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>

                {/* Image Info */}
                <div className="p-4">
                  {editingImageId === img.id ? (
                    /* Edit Mode */
                    <div className="space-y-3">
                      <textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] rounded-lg text-white text-sm focus:ring-2 focus:ring-[#a88fd8] resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveImageEdit(img.id)}
                          className="flex-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm flex items-center justify-center gap-1 transition"
                        >
                          <Save className="w-3 h-3" /> Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex-1 px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* View Mode */
                    <>
                      <p className="text-sm text-gray-400 line-clamp-2 mb-3 min-h-[2.5rem]">
                        {img.prompt || "No description"}
                      </p>

                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs text-gray-500">
                          {new Date(img.created_at).toLocaleDateString()}
                        </span>
                        {img.clicks > 0 && (
                          <span className="text-xs text-[#a88fd8]">
                            {img.clicks} clicks
                          </span>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDownloadImage(img.image_url, img.prompt)}
                          title="Download"
                          className="flex-1 p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition flex items-center justify-center gap-1 text-sm"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditImage(img)}
                          title="Edit prompt"
                          className="flex-1 p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition flex items-center justify-center gap-1 text-sm"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteImage(img.id)}
                          title="Delete from cloud"
                          className="flex-1 p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition flex items-center justify-center gap-1 text-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ==================== IMAGE MODAL (Full View) ==================== */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-5xl max-h-[90vh] bg-[#16111d]/95 p-4 sm:p-5 rounded-2xl border border-[#2a2235] shadow-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-2 text-gray-300 hover:text-white bg-black/50 rounded-lg backdrop-blur-sm z-10 transition"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Wrapper: switches between row (portrait) and column (landscape) */}
            <div
              className={`flex gap-6 items-start justify-center ${selectedImage.isPortrait ? "flex-row" : "flex-col"
                }`}
            >
              {/* Image */}
              <div
                className={`flex justify-center items-center ${selectedImage.isPortrait ? "max-w-[55%]" : "w-full"
                  }`}
              >
                <img
                  src={selectedImage.image_url}
                  alt={selectedImage.prompt}
                  className={`rounded-lg object-contain ${selectedImage.isPortrait ? "max-h-[80vh]" : "max-h-[60vh]"
                    }`}
                />
              </div>

              {/* Details */}
              <div
                className={`text-center space-y-3 px-2 ${selectedImage.isPortrait ? "w-[45%]" : "w-full"
                  }`}
              >
                <p className="text-gray-300 break-words text-sm sm:text-base">
                  {selectedImage.prompt || "No description"}
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() =>
                      handleDownloadImage(selectedImage.image_url, selectedImage.prompt)
                    }
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" /> Download
                  </button>

                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      handleEditImage(selectedImage);
                    }}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition"
                  >
                    <Edit3 className="w-4 h-4" /> Edit
                  </button>
                </div>

                <p className="text-xs text-gray-500">
                  Created: {new Date(selectedImage.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}