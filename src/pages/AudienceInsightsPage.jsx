import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { TrendingUp, TrendingDown, AlertCircle, Brain, Donut } from "lucide-react";

export default function AudienceInsightsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const COLORS = ["#a88fd8", "#60a5fa", "#34d399", "#f59e0b", "#f87171", "#8b5cf6"];

  useEffect(() => {
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) fetchInsights();
  }, [selectedCampaign]);

  const fetchCampaigns = async () => {
    try {
      const response = await apiClient.get("/campaigns/");
      setCampaigns(response.data);
      if (response.data.length > 0) {
        setSelectedCampaign(response.data[0].id);
      }
    } catch {
      toast.error("Could not fetch campaigns.");
    }
  };

  const fetchInsights = async () => {
    if (!selectedCampaign) return;
    setIsLoading(true);
    try {
      const response = await apiClient.get("/audience/insights/", {
        params: { campaign_id: selectedCampaign },
      });
      setInsights(response.data);
    } catch (error) {
      console.error("Insights error:", error);
      toast.error("Failed to load audience insights.");
    } finally {
      setIsLoading(false);
    }
  };

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 text-center min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-gray-300">
        <svg
          className="mx-auto h-12 w-12 text-[#a88fd8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 
            00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 
            0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 
            5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 
            0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 
            2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <h3 className="mt-4 text-xl font-semibold">No Campaigns Found</h3>
        <p className="mt-2 text-sm text-gray-500">Create a campaign to view audience insights.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2">
            <span className="p-2 rounded-full bg-[#a88fd8]/20 border border-[#a88fd8]/30">
              <Brain className="w-6 h-6 text-[#a88fd8]" />
            </span>
            Audience Insights
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            Understand your audience and improve ad performance
          </p>
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg text-white text-sm 
            focus:ring-2 focus:ring-[#a88fd8]"
          >
            <option value="">All Campaigns</option>
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin h-12 w-12 border-4 border-[#a88fd8] border-t-transparent rounded-full"></div>
        </div>
      ) : insights ? (
        <>
          {/* Summary Cards with Trend (Updated Icons) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">

            {/* Total Reach */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#5A74F5] to-[#7686FF] shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-80">Total Reach</p>
                <div className="p-2 bg-white/20 rounded-full">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-3xl font-bold mt-1">{insights.total_reach?.toLocaleString() || 0}</p>
              <p className="text-xs opacity-75 mt-2">Unique impressions</p>
            </div>

            {/* Engaged Users */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#15C39A] to-[#26DFA8] shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-80">Engaged Users</p>
                <div className="p-2 bg-white/20 rounded-full">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>

              <p className="text-3xl font-bold mt-1">{insights.engaged_users?.toLocaleString() || 0}</p>

              <div className="flex items-center gap-2 mt-2">
                <p className="text-xs opacity-75">Users who interacted</p>

                {insights.engagement_trend === "Increasing" ? (
                  <span className="flex items-center text-xs text-white">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {insights.engagement_change}
                  </span>
                ) : (
                  <span className="flex items-center text-xs text-white">
                    <TrendingDown className="w-4 h-4 mr-1" />
                    {insights.engagement_change}
                  </span>
                )}
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="p-6 rounded-xl bg-gradient-to-br from-[#A788FF] to-[#C9A3FF] shadow-lg hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <p className="text-sm opacity-80">Engagement Rate</p>
                <div className="p-2 bg-white/20 rounded-full">
                  <Donut className="w-6 h-6 text-white" />
                </div>
              </div>

              <p className="text-3xl font-bold mt-1">{insights.engagement_rate || 0}%</p>

              <p className="text-xs opacity-75 mt-2">
                {insights.engagement_rate >= 5
                  ? "🔥 Excellent!"
                  : insights.engagement_rate >= 3
                    ? "✅ Good"
                    : "⚠️ Needs improvement"}
              </p>
            </div>

          </div>


          {/* AI Recommendations */}
          {insights.recommendations?.length > 0 && (
            <div className="p-6 rounded-xl mb-10 bg-black/30 border border-white/10 backdrop-blur-lg">
              <h2 className="text-lg md:text-xl font-semibold text-[#a88fd8] mb-4 flex items-center gap-2">
                🤖 AI-Powered Recommendations
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border-l-4 ${rec.priority === "high"
                      ? "border-red-500 bg-red-500/10"
                      : rec.priority === "medium"
                        ? "border-yellow-400 bg-yellow-400/10"
                        : "border-blue-400 bg-blue-400/10"
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${rec.priority === "high"
                          ? "bg-red-500/20 text-red-300"
                          : rec.priority === "medium"
                            ? "bg-yellow-400/20 text-yellow-200"
                            : "bg-blue-400/20 text-blue-200"
                          }`}
                      >
                        {rec.priority}
                      </span>
                      {rec.priority === "high" && <AlertCircle className="w-4 h-4 text-red-400" />}
                    </div>

                    <p className="font-semibold text-gray-100 capitalize text-sm">
                      {rec.type}
                    </p>
                    <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                      {rec.message}
                    </p>
                    {rec.action && (
                      <button className="mt-3 text-xs px-3 py-1.5 bg-[#a88fd8]/20 hover:bg-[#a88fd8]/30 rounded-md transition-colors">
                        {rec.action}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Demographics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Age Distribution */}
            {insights.age_groups?.length > 0 && (
              <div className="p-6 bg-black/30 border border-white/10 rounded-xl backdrop-blur-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#a88fd8]">
                  Age Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={insights.age_groups}>
                    <CartesianGrid stroke="#2c2c2c" strokeDasharray="3 3" />
                    <XAxis dataKey="range" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #a88fd8",
                        borderRadius: "8px"
                      }}
                    />
                    <Bar dataKey="percentage" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {insights.age_groups.map((age, i) => (
                    <div key={i} className="text-xs text-gray-400 flex justify-between">
                      <span>{age.range}</span>
                      <span className={`${age.engagement === 'Very High' ? 'text-green-400' :
                        age.engagement === 'High' ? 'text-blue-400' :
                          age.engagement === 'Medium' ? 'text-yellow-400' :
                            'text-gray-500'
                        }`}>
                        {age.engagement}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gender Distribution */}
            {insights.gender?.length > 0 && (
              <div className="p-6 bg-black/30 border border-white/10 rounded-xl backdrop-blur-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#a88fd8]">
                  Gender Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={insights.gender}
                      dataKey="percentage"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ type, percentage }) => `${type}: ${percentage}%`}
                    >
                      {insights.gender.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        border: "1px solid #a88fd8",
                        borderRadius: "8px",
                        color: "#ffffff",     // Main text color
                      }}
                      itemStyle={{
                        color: "#ffffff",     // Label/value text color
                      }}
                      labelStyle={{
                        color: "#ffffff",     // Title text color
                      }}
                    />

                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Interests */}
          {insights.interests?.length > 0 && (
            <div className="p-6 rounded-xl bg-black/30 border border-white/10 backdrop-blur-lg mb-10">
              <h3 className="text-lg md:text-xl font-semibold text-[#a88fd8] mb-4">
                Top Interests
              </h3>

              <div className="space-y-3">
                {insights.interests.map((interest, i) => (
                  <div key={i}>
                    <div className="flex justify-between mb-1 text-sm">
                      <span className="text-gray-300">{interest.name}</span>
                      <span className="text-gray-100 font-semibold">{interest.score}%</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a88fd8] transition-all duration-500"
                        style={{ width: `${interest.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Best Times & Locations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Best Times */}
            {insights.best_times?.length > 0 && (
              <div className="p-6 rounded-xl bg-black/30 border border-white/10 backdrop-blur-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#a88fd8]">
                  📅 Best Times to Post
                </h3>

                {insights.best_times.map((t, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-3 bg-black/40 
                    border border-white/5 rounded-lg mb-2 hover:border-[#a88fd8]/30 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-100">{t.day}</p>
                      <p className="text-sm text-gray-400">{t.time}</p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm ${t.engagement === "Very High"
                        ? "bg-green-500/20 text-green-300"
                        : t.engagement === "High"
                          ? "bg-blue-500/20 text-blue-300"
                          : t.engagement === "Medium"
                            ? "bg-yellow-500/20 text-yellow-200"
                            : "bg-gray-500/20 text-gray-300"
                        }`}
                    >
                      {t.engagement}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Top Locations */}
            {insights.top_locations?.length > 0 && (
              <div className="p-6 rounded-xl bg-black/30 border border-white/10 backdrop-blur-lg">
                <h3 className="text-lg md:text-xl font-semibold mb-4 text-[#a88fd8]">
                  📍 Top Locations
                </h3>

                {insights.top_locations.map((loc, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between items-center mb-1 text-sm">
                      <span className="text-gray-300">{loc.city}</span>
                      <span className="text-gray-100 font-semibold">{loc.percentage}%</span>
                    </div>

                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#a88fd8] transition-all duration-500"
                        style={{ width: `${loc.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Note */}
          {insights.data_note && (
            <div className="p-4 rounded-xl bg-[#a88fd8]/10 border border-[#a88fd8]/30 backdrop-blur-md">
              <p className="text-sm text-gray-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{insights.data_note}</span>
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          Select a campaign to view insights
        </div>
      )}
    </div>
  );
}