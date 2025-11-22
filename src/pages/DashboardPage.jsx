// frontend/src/pages/DashboardPage.jsx — AdVision Unified Redesign (Responsive Upgrade)
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  RefreshCcw,
  Plus,
  BarChart3,
  Rocket,
  FileText,
  Image,
  Sparkles,
  KeyRound,
  DollarSign,
  FolderOpen,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/dashboard/stats/");
      setStats(response.data);
    } catch (error) {
      toast.error("Failed to load dashboard statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncComplete = async () => {
    setIsSyncing(true);
    const toastId = toast.loading("Syncing campaigns from your ad platforms...");
    try {
      const response = await apiClient.post("/sync/campaigns/");
      if (response.data.success) {
        const { summary } = response.data;
        toast.success(
          `Synced ${summary.successful}/${summary.total_platforms} platforms successfully!`,
          { id: toastId, duration: 5000 }
        );
        fetchStats();
      } else {
        toast.error("Sync failed", { id: toastId });
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Failed to sync. Please add API keys first.",
        { id: toastId }
      );
    } finally {
      setIsSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f0c12]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a88fd8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white px-4 sm:px-6 lg:px-8 py-10">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-3">
            <BarChart3 className="w-7 h-7 text-[#a88fd8]" /> Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Your AdVision performance overview
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={handleSyncComplete}
            disabled={isSyncing}
            className={`px-5 py-2.5 rounded-xl font-medium flex justify-center items-center gap-2 shadow-lg transition-all duration-300 w-full sm:w-auto
              ${
                isSyncing
                  ? "opacity-60 cursor-not-allowed bg-gradient-to-r from-gray-600 to-gray-700"
                  : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              }`}
          >
            {isSyncing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              <>
                <RefreshCcw className="w-5 h-5" />
                Sync Campaigns
              </>
            )}
          </button>

          <Link
            to="/app/campaigns"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#3a3440] to-[#a88fd8] hover:brightness-110 text-white font-medium flex justify-center items-center gap-2 shadow-lg transition-all duration-300 w-full sm:w-auto"
          >
            <Plus className="w-5 h-5" />
            New Campaign
          </Link>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Campaigns",
            value: stats?.total_campaigns || 0,
            color: "from-[#4f46e5] to-[#818cf8]",
            icon: <Rocket className="w-8 h-8" />,
          },
          {
            title: "Active Campaigns",
            value: stats?.active_campaigns || 0,
            color: "from-[#059669] to-[#34d399]",
            icon: <BarChart3 className="w-8 h-8" />,
          },
          {
            title: "Ad Content",
            value: stats?.total_ads || 0,
            color: "from-[#7c3aed] to-[#c084fc]",
            icon: <FileText className="w-8 h-8" />,
          },
          {
            title: "Images Generated",
            value: stats?.total_images || 0,
            color: "from-[#f97316] to-[#fb923c]",
            icon: <Image className="w-8 h-8" />,
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl bg-gradient-to-br ${card.color} shadow-lg hover:shadow-2xl transform hover:scale-[1.03] transition-all duration-300 backdrop-blur-lg bg-opacity-80`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">{card.title}</p>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
              <div className="p-3 bg-white/20 rounded-full text-white">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-[#16111d]/60 border border-[#2a2235] rounded-2xl backdrop-blur-md p-6 mb-10 shadow-[0_0_20px_rgba(189,168,200,0.15)]">
        <h2 className="text-xl font-semibold mb-5 tracking-wide text-[#d9d3e8] flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-[#a88fd8]" /> Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {[
            {
              title: "Create Campaign",
              subtitle: "Start a new ad campaign",
              icon: <BarChart3 className="w-8 h-8 mx-auto mb-2 text-[#a88fd8]" />,
              link: "/app/campaigns",
            },
            {
              title: "Generate Content",
              subtitle: "Create AI-powered ad creatives",
              icon: <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#a88fd8]" />,
              link: "/app/generator",
            },
            {
              title: "View Content Library",
              subtitle: "Manage your ads and visuals",
              icon: <FolderOpen className="w-8 h-8 mx-auto mb-2 text-[#a88fd8]" />,
              link: "/app/library",
            },
            {
              title: "API Keys",
              subtitle: "Connect your ad platforms",
              icon: <KeyRound className="w-8 h-8 mx-auto mb-2 text-[#a88fd8]" />,
              link: "/app/api-keys",
            },
          ].map((item, i) => (
            <Link
              key={i}
              to={item.link}
              className="p-5 rounded-xl border border-white/20 bg-black/30 hover:bg-[#a88fd8]/10 hover:shadow-[0_0_15px_rgba(189,168,200,0.3)] transition-all duration-300 text-center group"
            >
              {item.icon}
              <div className="font-semibold text-[#EAEAEA] group-hover:text-white transition">
                {item.title}
              </div>
              <div className="text-sm text-gray-400">{item.subtitle}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* BUDGET SUMMARY */}
      {stats?.total_budget > 0 && (
        <div className="bg-gradient-to-r from-[#3a3440] to-[#a88fd8] p-6 rounded-xl shadow-lg text-white backdrop-blur-md w-full">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-6 h-6 text-white" />
            <h3 className="text-lg font-semibold">Total Campaign Budget</h3>
          </div>

          <p className="text-4xl font-bold">${stats.total_budget.toFixed(2)}</p>

          <p className="text-sm mt-2 opacity-90">
            Across all your active campaigns
          </p>
        </div>
      )}
    </div>
  );
}
