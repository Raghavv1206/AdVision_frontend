// frontend/src/pages/AnalyticsPage.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  BarChart3,
  LineChart as LineIcon,
  PieChart,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";

export default function AnalyticsPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await apiClient.get("/campaigns/");
        setCampaigns(response.data);
        if (response.data.length > 0) {
          setSelectedCampaign(response.data[0].id);
        }
      } catch (error) {
        toast.error("Could not fetch campaigns.");
      }
    };
    fetchCampaigns();
  }, []);

  useEffect(() => {
    if (selectedCampaign) {
      fetchAnalytics();
    }
  }, [selectedCampaign]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/analytics/summary/", {
        params: { campaign_id: selectedCampaign },
      });
      setAnalyticsData(response.data);
    } catch (error) {
      toast.error("Failed to load analytics.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = analyticsData
    ? analyticsData.dates.map((date, index) => ({
        date,
        impressions: analyticsData.impressions[index],
        clicks: analyticsData.clicks[index],
        conversions: analyticsData.conversions[index],
        spend: analyticsData.spend[index],
        ctr: analyticsData.ctr[index],
      }))
    : [];

  if (campaigns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-gray-300 p-6 text-center">
        <BarChart3 className="w-14 h-14 text-[#a88fd8] mb-4" />
        <h3 className="text-2xl font-semibold">No Campaigns Found</h3>
        <p className="text-gray-400 mt-2">Create a campaign to view analytics.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2">
            <Activity className="w-7 h-7 text-[#a88fd8]" /> Real-Time Analytics
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            Live performance metrics for your AdVision campaigns
          </p>
        </div>

        <div className="w-full md:w-64">
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
          >
            {campaigns.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loader */}
      {isLoading ? (
        <div className="flex justify-center py-16 md:py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a88fd8]" />
        </div>
      ) : analyticsData ? (
        <>
          {/* Four KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Impressions",
                value: analyticsData.total_impressions.toLocaleString(),
                color: "from-[#3b82f6] to-[#60a5fa]",
                icon: <Eye className="w-6 h-6" />,
                sub: `Last ${analyticsData.days_active} days`,
              },
              {
                title: "Clicks",
                value: analyticsData.total_clicks.toLocaleString(),
                color: "from-[#10b981] to-[#34d399]",
                icon: <TrendingUp className="w-6 h-6" />,
                sub: `CTR: ${analyticsData.avg_ctr}%`,
              },
              {
                title: "Conversions",
                value: analyticsData.total_conversions.toLocaleString(),
                color: "from-[#8b5cf6] to-[#a78bfa]",
                icon: <PieChart className="w-6 h-6" />,
                sub: `Rate: ${analyticsData.conversion_rate}%`,
              },
              {
                title: "Total Spend",
                value: `$${analyticsData.total_spend.toLocaleString()}`,
                color: "from-[#f59e0b] to-[#fbbf24]",
                icon: <DollarSign className="w-6 h-6" />,
                sub: `ROAS: ${analyticsData.roas}x`,
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${card.color} p-5 md:p-6 rounded-xl shadow-lg text-white hover:shadow-2xl transition-all duration-300`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm opacity-90">{card.title}</p>
                    <p className="text-2xl md:text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
                </div>
                <p className="text-xs opacity-80">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Campaign Overview */}
          <div className="bg-white/10 border border-white/10 rounded-xl p-6 mb-8 shadow-lg backdrop-blur-md">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4 mb-4">
              <div>
                <h2 className="text-xl font-semibold text-[#a88fd8]">
                  {analyticsData.campaign_name}
                </h2>
                <p className="text-sm text-gray-400">
                  Platform:{" "}
                  <span className="capitalize font-medium text-gray-200">
                    {analyticsData.platform}
                  </span>
                </p>
              </div>
              <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                Performance Score: {analyticsData.performance_score}/100
              </div>
            </div>

            {/* Mini Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Ad Content", value: analyticsData.ad_count },
                { label: "Images", value: analyticsData.image_count },
                { label: "Avg CPC", value: `$${analyticsData.avg_cpc}` },
                {
                  label: "Cost/Conv",
                  value: `$${analyticsData.cost_per_conversion}`,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="text-center bg-black/30 border border-white/10 rounded-lg p-4 hover:bg-[#a88fd8]/10 transition-all"
                >
                  <p className="text-gray-400 text-sm">{item.label}</p>
                  <p className="text-lg md:text-xl font-bold text-white mt-1">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CHARTS */}
          <div className="space-y-8">

            {/* LINE CHART */}
            <div className="bg-black/30 border border-white/10 p-5 md:p-6 rounded-xl">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-[#a88fd8]">
                <LineIcon className="w-5 h-5" /> Performance Over Time
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
                  <XAxis dataKey="date" stroke="#a1a1aa" />
                  <YAxis stroke="#a1a1aa" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e1e1e",
                      borderRadius: "10px",
                      border: "none",
                    }}
                    labelStyle={{ color: "#a88fd8" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
                  <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="conversions" stroke="#8B5CF6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* CTR Chart */}
              <div className="bg-black/30 border border-white/10 p-5 md:p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-[#a88fd8]">Click-Through Rate (CTR)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
                    <XAxis dataKey="date" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        borderRadius: "10px",
                      }}
                    />
                    <Bar dataKey="ctr" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Spend Chart */}
              <div className="bg-black/30 border border-white/10 p-5 md:p-6 rounded-xl">
                <h3 className="text-lg font-semibold mb-4 text-[#a88fd8]">Daily Spend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2c2c2c" />
                    <XAxis dataKey="date" stroke="#a1a1aa" />
                    <YAxis stroke="#a1a1aa" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e1e1e",
                        borderRadius: "10px",
                      }}
                    />
                    <Bar dataKey="spend" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-black/30 border border-white/10 p-5 md:p-6 rounded-xl overflow-x-auto">
              <h3 className="text-lg font-semibold mb-4 text-[#a88fd8]">Detailed Daily Breakdown</h3>

              <table className="min-w-full text-sm text-gray-300 border-collapse">
                <thead className="bg-black/40 text-gray-400 uppercase text-xs">
                  <tr>
                    {["Date", "Impressions", "Clicks", "CTR", "Conversions", "Spend"].map((h) => (
                      <th key={h} className="px-4 py-2 text-left font-semibold whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {chartData.map((row, i) => (
                    <tr
                      key={i}
                      className="hover:bg-[#a88fd8]/10 border-b border-gray-800 transition"
                    >
                      <td className="px-4 py-2 whitespace-nowrap">{row.date}</td>
                      <td className="px-4 py-2">{row.impressions.toLocaleString()}</td>
                      <td className="px-4 py-2">{row.clicks.toLocaleString()}</td>
                      <td className="px-4 py-2">{row.ctr}%</td>
                      <td className="px-4 py-2">{row.conversions}</td>
                      <td className="px-4 py-2">${row.spend.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          Select a campaign to view analytics
        </div>
      )}
    </div>
  );
}
