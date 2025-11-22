// frontend/src/pages/ProfilePage.jsx — AdVision Dark Improved v2
import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  User,
  Edit3,
  Save,
  X,
  ShieldCheck,
  AlertTriangle,
  Mail,
  FileText,
  Briefcase,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    bio: "",
    role: "",
  });

  /* ----------------------- FETCH PROFILE ----------------------- */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get("/profile/");
      setProfile(res.data);

      setFormData({
        bio: res.data.bio || "",
        role: res.data.role,
      });

      fetchStats(); // load stats AFTER profile
    } catch {
      toast.error("Failed to load profile.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ----------------------- FETCH STATS ----------------------- */
  const fetchStats = async () => {
    try {
      const res = await apiClient.get("/dashboard/stats/");
      setStats(res.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  /* ----------------------- UPDATE PROFILE ----------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating profile...");

    try {
      const res = await apiClient.patch("/profile/", formData);
      setProfile(res.data);
      setIsEditing(false);
      toast.success("Profile updated!", { id: toastId });
    } catch {
      toast.error("Failed to update profile.", { id: toastId });
    }
  };

  /* ----------------------- LOADING STATE ----------------------- */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0f0c12]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a88fd8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white p-8 animate-fadeInSlow">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold flex items-center gap-3">
          <User className="w-7 h-7 text-[#a88fd8]" /> Profile Settings
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your AdVision account information
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ----------------------- PROFILE CARD ----------------------- */}
        <div className="bg-[#16111d]/70 border border-[#2a2235] rounded-2xl p-6 text-center shadow-lg hover:shadow-[#a88fd8]/20 transition-all duration-300">

          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-[#3a3440] to-[#a88fd8] mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white shadow-inner">
            {profile.email.charAt(0).toUpperCase()}
          </div>

          <h2 className="text-xl font-semibold">{profile.email}</h2>
          <p className="text-sm text-gray-400 capitalize">
            {profile.role} Account
          </p>

          <div className="mt-6 flex justify-center gap-2 items-center text-[#a88fd8] text-sm">
            <ShieldCheck className="w-4 h-4" />
            Verified Account
          </div>
        </div>

        {/* ----------------------- PROFILE INFO ----------------------- */}
        <div className="lg:col-span-2 space-y-6">

          {/* Info Card */}
          <div className="bg-[#16111d]/70 border border-[#2a2235] rounded-2xl p-6 shadow-lg">

            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-semibold text-[#d9d3e8]">
                Profile Information
              </h3>

              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3a3440] to-[#a88fd8] hover:brightness-110 flex items-center gap-2 text-sm font-medium shadow-md"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>

            {isEditing ? (
              /* ----------------------- EDIT MODE ----------------------- */
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Email */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="flex items-center bg-[#0f0c12] border border-[#2a2235] rounded-lg px-3 py-2 text-gray-400">
                    <Mail className="w-4 h-4 mr-2 text-[#a88fd8]" />
                    {profile.email}
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows="4"
                    className="w-full bg-[#0f0c12] border border-[#2a2235] rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-[#a88fd8]"
                  />
                </div>

                {/* Role (Read-Only) */}
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Account Type</label>
                  <div className="flex items-center capitalize bg-[#0f0c12] border border-[#2a2235] rounded-lg px-3 py-2 text-gray-300">
                    <Briefcase className="w-4 h-4 mr-2 text-[#a88fd8]" />
                    {profile.role}
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ bio: profile.bio || "", role: profile.role });
                    }}
                    className="px-4 py-2 rounded-lg bg-[#2a2235] text-gray-300 hover:bg-[#3a3440] transition"
                  >
                    <X className="w-4 h-4 inline-block mr-1" /> Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white hover:brightness-110 transition shadow-md"
                  >
                    <Save className="w-4 h-4 inline-block mr-1" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              /* ----------------------- VIEW MODE ----------------------- */
              <div className="space-y-4 text-gray-300">

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Email</label>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-[#a88fd8]" />
                    {profile.email}
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Bio</label>
                  <p className="text-gray-300">
                    {profile.bio || <i className="text-gray-500">No bio added yet</i>}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Account Type</label>
                  <div className="flex items-center capitalize">
                    <Briefcase className="w-4 h-4 mr-2 text-[#a88fd8]" />
                    {profile.role}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* ----------------------- STATS ----------------------- */}
          <div className="bg-[#16111d]/70 border border-[#2a2235] rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-[#d9d3e8] mb-5 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#a88fd8]" /> Account Statistics
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Total Campaigns", value: stats?.total_campaigns || 0, color: "text-blue-400" },
                { label: "Generated Ads", value: stats?.total_ads || 0, color: "text-green-400" },
                { label: "Generated Images", value: stats?.total_images || 0, color: "text-purple-400" },
                { label: "Active", value: stats?.active_campaigns || 0, color: "text-orange-400" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center p-4 bg-[#0f0c12]/70 border border-[#2a2235] rounded-xl hover:border-[#a88fd8]/40 transition-all"
                >
                  <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                  <p className="text-sm text-gray-400 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ----------------------- DANGER ZONE ----------------------- */}
          <div className="bg-[#16111d]/70 border border-red-500/30 rounded-2xl p-6 shadow-md mt-6">
            <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5" /> Danger Zone
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              Once you delete your account, there is no going back.
            </p>

            <button
              onClick={() =>
                window.confirm("Are you absolutely sure? This will delete ALL your data.") &&
                toast.error("Account deletion disabled. Contact support.")
              }
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 transition"
            >
              <X className="w-4 h-4" /> Delete Account
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
