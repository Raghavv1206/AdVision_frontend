// frontend/src/pages/CampaignsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  Plus,
  Eye,
  Edit3,
  Trash2,
  Calendar,
  DollarSign,
  Megaphone,
  X,
} from "lucide-react";

export default function CampaignsPage() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    platform: "instagram",
    budget: "",
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/campaigns/");
      setCampaigns(response.data);
    } catch (error) {
      toast.error("Could not fetch campaigns.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const openCreateModal = () => {
    setEditingCampaign(null);
    setFormData({
      title: "",
      description: "",
      start_date: "",
      end_date: "",
      platform: "instagram",
      budget: "",
    });
    setShowModal(true);
  };

  const openEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setFormData({
      title: campaign.title,
      description: campaign.description || "",
      start_date: campaign.start_date,
      end_date: campaign.end_date,
      platform: campaign.platform,
      budget: campaign.budget || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(
      editingCampaign ? "Updating campaign..." : "Creating campaign..."
    );

    try {
      if (editingCampaign) {
        await apiClient.patch(`/campaigns/${editingCampaign.id}/`, formData);
        toast.success("Campaign updated!", { id: toastId });
      } else {
        await apiClient.post("/campaigns/", formData);
        toast.success("Campaign created!", { id: toastId });
      }

      setShowModal(false);
      fetchCampaigns();
    } catch (error) {
      toast.error("Operation failed.", { id: toastId });
    }
  };

  const handleDelete = async (id) => {
    const toastId = toast.loading("Deleting campaign...");
    try {
      await apiClient.delete(`/campaigns/${id}/`);
      toast.success("Campaign deleted!", { id: toastId });
      setDeleteConfirm(null);
      fetchCampaigns();
    } catch {
      toast.error("Failed to delete.", { id: toastId });
    }
  };

  const viewCampaignDetails = (id) => navigate(`/app/campaigns/${id}`);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white px-4 sm:px-6 lg:px-8 py-10">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-wide flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-[#a88fd8]" /> Campaigns
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage and monitor your ad campaigns
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-[#3a3440] 
          to-[#a88fd8] hover:brightness-110 text-white rounded-lg 
          flex items-center justify-center gap-2 shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Create Campaign
        </button>
      </div>

      {/* Campaign Cards */}
      <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl p-4 sm:p-6 shadow-[inset_0_0_12px_rgba(168,143,216,0.1)]">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-[#a88fd8] border-t-transparent rounded-full"></div>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16">
            <Megaphone className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-sm">
              No campaigns found. Click{" "}
              <span className="text-[#a88fd8] font-medium">"Create Campaign"</span> to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {campaigns.map((c) => (
              <div
                key={c.id}
                className="relative bg-[#1b1422]/80 border border-[#2a2235] rounded-2xl p-5 
                hover:border-[#a88fd8]/40 transition-all hover:shadow-[0_0_20px_rgba(168,143,216,0.2)]"
              >
                {/* Top right buttons */}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => viewCampaignDetails(c.id)}
                    className="p-1.5 text-blue-400 hover:bg-blue-500/10 rounded-md"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-green-400 hover:bg-green-500/10 rounded-md"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(c.id)}
                    className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-md"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <h2 className="text-xl font-semibold text-[#c4a8ff] mb-2 pr-20">
                  {c.title}
                </h2>

                <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                  {c.description || "No description provided."}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
                  <span className="capitalize px-2 py-0.5 bg-[#2b2435] rounded-full">
                    {c.platform}
                  </span>

                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {c.start_date} → {c.end_date}
                  </span>

                  {c.budget && (
                    <span className="flex items-center gap-1 font-semibold text-[#f8c16c]">
                      <DollarSign className="w-4 h-4" /> ${c.budget}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-[#1c1624] border border-[#2a2235] 
      p-5 sm:p-6 rounded-2xl shadow-2xl 
      w-full max-w-lg relative scale-100">

      {/* Close Button */}
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-3 right-3 text-gray-400 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <h2 className="text-xl sm:text-2xl font-semibold text-[#c4a8ff] mb-5">
        {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
            className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
            rounded-md text-white text-base"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            rows="3"
            className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
            rounded-md text-white text-base"
          />
        </div>

        {/* Platform */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Platform</label>
          <select
            name="platform"
            value={formData.platform}
            onChange={handleFormChange}
            className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
            rounded-md text-white text-base"
          >
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>

        {/* Date Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1 text-gray-300">Start Date</label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleFormChange}
              required
              className="custom-date w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
              rounded-md text-white text-base"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">End Date</label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleFormChange}
              required
              className="custom-date w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
              rounded-md text-white text-base"
            />
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm mb-1 text-gray-300">Budget</label>
          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleFormChange}
            className="w-full px-3 py-2 bg-[#0f0c12] border border-[#2a2235] 
            rounded-md text-white text-base"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="px-4 py-2 bg-gray-700/30 text-gray-300 rounded-lg text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-gradient-to-r from-[#3a3440] 
            to-[#a88fd8] text-white rounded-lg text-sm"
          >
            {editingCampaign ? "Update" : "Create"}
          </button>
        </div>

      </form>
    </div>
  </div>
)}



      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-[#1c1624] border border-[#2a2235] p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">

            <h3 className="text-xl font-semibold text-red-400 mb-3">
              Confirm Deletion
            </h3>

            <p className="text-gray-300 mb-6">
              Are you sure you want to delete this campaign? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-700/30 text-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
