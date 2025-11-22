// frontend/src/pages/CampaignDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import { Eye, Edit2, Trash2, ArrowLeft } from "lucide-react";

export default function CampaignDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchCampaignDetails();
  }, [id]);

  const fetchCampaignDetails = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/campaigns/${id}/`);
      setCampaign(response.data);
    } catch (error) {
      toast.error("Failed to load campaign details.");
      navigate("/app/campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      await apiClient.post("/comments/", { campaign: id, message: commentText });
      toast.success("Comment added!");
      setCommentText("");
      fetchCampaignDetails();
    } catch {
      toast.error("Failed to add comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await apiClient.delete(`/comments/${commentId}/`);
      toast.success("Comment deleted!");
      fetchCampaignDetails();
    } catch {
      toast.error("Failed to delete comment.");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11]">
        <div className="h-12 w-12 border-4 border-[#a88fd8] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!campaign)
    return <div className="text-center text-gray-400 py-20">Campaign not found.</div>;

  return (
    <div className="min-h-screen px-4 md:px-8 py-10 bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white">

      {/* Header Responsive */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-10">
        <Link
          to="/app/campaigns"
          className="text-[#a88fd8] hover:text-white flex items-center gap-2 text-sm md:text-base"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Campaigns
        </Link>

        <Link
          to={`/app/analytics?campaign=${campaign.id}`}
          className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] rounded-lg hover:brightness-110 transition-all shadow-md text-center"
        >
          View Analytics
        </Link>
      </div>

      {/* Campaign Card */}
      <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6 shadow-[inset_0_0_12px_rgba(168,143,216,0.1)] mb-10">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-start mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-[#c4a8ff] break-words">
              {campaign.title}
            </h1>
            <p className="text-gray-400 mt-2 break-words">{campaign.description}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-sm px-3 py-1 bg-[#2b2435] rounded-full capitalize text-gray-300">
              {campaign.platform}
            </span>
            <span className="text-[#ffb347] font-medium text-lg">
              ${campaign.budget || 0}
            </span>
          </div>
        </div>

        {/* Info Row */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
          <p><strong>Duration:</strong> {campaign.start_date} → {campaign.end_date}</p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(campaign.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-6 shadow-[inset_0_0_12px_rgba(168,143,216,0.1)]">

        {/* Tabs (scrollable on mobile) */}
        <div className="flex gap-6 border-b border-[#2a2235] mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: "overview", label: "Overview" },
            { id: "content", label: `Ad Content (${campaign.ad_content?.length || 0})` },
            { id: "images", label: `Images (${campaign.images?.length || 0})` },
            { id: "comments", label: `Comments (${campaign.comments?.length || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 whitespace-nowrap text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "text-[#a88fd8] border-b-2 border-[#a88fd8]"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Ad Copy Generated", value: campaign.ad_content?.length || 0 },
              { label: "Images Created", value: campaign.images?.length || 0 },
              { label: "Team Comments", value: campaign.comments?.length || 0 },
            ].map((stat, i) => (
              <div
                key={i}
                className="p-5 bg-[#1b1422] rounded-xl text-center border border-[#2a2235] hover:border-[#a88fd8]/40 transition"
              >
                <p className="text-3xl font-bold text-[#a88fd8]">{stat.value}</p>
                <p className="text-sm text-gray-400 mt-2">{stat.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Ad Content */}
        {activeTab === "content" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {campaign.ad_content?.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No ad content yet.</p>
            ) : (
              campaign.ad_content.map((ad) => (
                <div
                  key={ad.id}
                  className="relative p-5 bg-[#1b1422] rounded-xl border border-[#2a2235] hover:border-[#a88fd8]/40 transition"
                >
                  {/* Buttons */}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="text-gray-400 hover:text-[#a88fd8]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="px-2 py-1 text-xs rounded bg-[#2b2435] text-gray-300 capitalize">
                      {ad.platform}
                    </span>
                    <span className="px-2 py-1 text-xs rounded bg-[#32273e] text-gray-300 capitalize">
                      {ad.tone}
                    </span>
                  </div>

                  <p className="text-gray-200 whitespace-pre-wrap break-words leading-relaxed mt-2">
                    {ad.text}
                  </p>

                  <p className="text-xs text-gray-500 mt-3">
                    {new Date(ad.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Images */}
        {activeTab === "images" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {campaign.images?.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No images yet.</p>
            ) : (
              campaign.images.map((img) => (
                <div
                  key={img.id}
                  className="relative bg-[#1b1422] rounded-xl border border-[#2a2235] hover:border-[#a88fd8]/40 transition overflow-hidden"
                >

                  <div className="absolute top-2 right-2 flex gap-2 z-10">
                    <button className="text-gray-400 hover:text-[#a88fd8]">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <img
                    src={img.image_url}
                    alt={img.prompt}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />

                  <div className="p-4">
                    <p className="text-sm text-gray-300 line-clamp-2">{img.prompt}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(img.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Comments */}
        {activeTab === "comments" && (
          <div className="space-y-6">
            {/* Add Comment */}
            <form
              onSubmit={handleAddComment}
              className="bg-[#1b1422] p-4 border border-[#2a2235] rounded-xl"
            >
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows="3"
                placeholder="Add a comment..."
                className="w-full bg-[#0f0c12] border border-[#2a2235] text-white text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#a88fd8] mb-3"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] rounded-lg hover:brightness-110 transition"
              >
                Add Comment
              </button>
            </form>

            {/* Comment List */}
            {campaign.comments?.length === 0 ? (
              <p className="text-center text-gray-400 py-10">No comments yet.</p>
            ) : (
              campaign.comments.map((comment) => (
                <div
                  key={comment.id}
                  className="flex justify-between items-start bg-[#1b1422] p-4 rounded-xl border border-[#2a2235] hover:border-[#a88fd8]/40 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#c4a8ff] truncate">
                      {comment.user.email}
                    </p>
                    <p className="text-gray-200 mt-1 break-words">{comment.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(comment.created_at).toLocaleString()}
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="ml-3 flex-shrink-0 text-red-400 hover:text-red-300 p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
