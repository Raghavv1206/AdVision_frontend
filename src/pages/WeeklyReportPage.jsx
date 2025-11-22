import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Target,
  Zap,
  Calendar,
  Download,
  Image
} from "lucide-react";

export default function WeeklyReportsPage() {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyReport();
  }, []);

  const fetchWeeklyReport = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/reports/weekly/");
      setReport(response.data);
    } catch (error) {
      console.error("Error fetching report:", error);
      toast.error("Failed to load weekly report");
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-500/10';
      case 'medium':
        return 'border-yellow-500 bg-yellow-500/10';
      case 'low':
        return 'border-green-500 bg-green-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'low':
        return 'bg-green-500/20 text-green-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'performance':
        return <TrendingUp className="w-4 h-4" />;
      case 'growth':
        return <Zap className="w-4 h-4" />;
      case 'engagement':
        return <Target className="w-4 h-4" />;
      case 'budget':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-[#a88fd8] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Report Available</h2>
          <p className="text-gray-400">Weekly report could not be loaded</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 md:px-6 py-10 bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2">
            <Calendar className="w-7 h-7 text-[#a88fd8]" />
            Weekly Performance Report
          </h1>
          <p className="text-gray-400 text-sm mt-1">{report.period}</p>
        </div>

        <button
          className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] rounded-lg 
          hover:brightness-110 transition-all flex items-center gap-2 text-sm"
          onClick={() => toast.success("Download feature coming soon!")}
        >
          <Download className="w-4 h-4" />
          Export PDF
        </button>
      </div>

      {/* Summary Cards */}
<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
  {[
    {
      label: "Campaigns",
      value: report.summary.campaigns_created,
      icon: <Target className="w-7 h-7 text-white" />,
      color: "from-[#5A74F5] to-[#7686FF]" // Soft dashboard blue
    },
    {
      label: "Ads Generated",
      value: report.summary.ads_generated,
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      color: "from-[#15C39A] to-[#26DFA8]" // Soft green from analytics
    },
    {
      label: "Images",
      value: report.summary.images_generated,
      icon: <Image className="w-7 h-7 text-white" />,
      color: "from-[#A788FF] to-[#C9A3FF]" // Purple (matching analytics)
    },
    {
      label: "Active",
      value: report.summary.active_campaigns,
      icon: <Zap className="w-7 h-7 text-white" />,
      color: "from-[#FFB84D] to-[#FFC766]" // Soft gold like dashboard
    },
    {
      label: "Engagement",
      value: report.summary.total_engagement?.toLocaleString() || 0,
      change: report.summary.engagement_growth,
      icon: <TrendingUp className="w-7 h-7 text-white" />,
      color: "from-[#FF6B8A] to-[#FF809C]" // Soft pink/red (muted)
    },
    {
      label: "Growth",
      value: report.summary.engagement_growth,
      icon: report.summary.engagement_growth?.includes("+")
        ? <TrendingUp className="w-7 h-7 text-white" />
        : <TrendingDown className="w-7 h-7 text-white" />,
      color: report.summary.engagement_growth?.includes("+")
        ? "from-[#3ECD78] to-[#49D98A]" // Muted green
        : "from-[#E6A74E] to-[#F0B55A]" // Soft amber (not harsh)
    },
  ].map((stat, i) => (
    <div
      key={i}
      className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} shadow-lg 
      hover:shadow-xl transition-all duration-300`}
    >
      <div className="flex items-center justify-between mb-1">
        {stat.icon}
        {stat.change && (
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              stat.change.includes("+")
                ? "bg-white/20 text-white"
                : "bg-black/20 text-white"
            }`}
          >
            {stat.change}
          </span>
        )}
      </div>
      <p className="text-xs opacity-90 text-white">{stat.label}</p>
      <p className="text-xl font-bold mt-0.5 text-white">{stat.value}</p>
    </div>
  ))}
</div>



      {/* Key Insights */}
      <div className="p-6 rounded-xl mb-10 bg-black/30 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-[#a88fd8] mb-6 flex items-center gap-2">
          📊 Key Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Top Performing Platform */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Top Platform</p>
            <p className="text-2xl font-bold text-[#a88fd8]">{report.insights.top_performing_platform}</p>
            <p className="text-xs text-gray-500 mt-1">Best performing channel</p>
          </div>

          {/* Best Campaign */}
          {report.insights.top_campaign_name !== 'N/A' && (
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Top Campaign</p>
              <p className="text-lg font-bold text-green-400 truncate">{report.insights.top_campaign_name}</p>
              <p className="text-xs text-gray-500 mt-1">Score: {report.insights.top_campaign_score}/100</p>
            </div>
          )}

          {/* Average CTR */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Average CTR</p>
            <p className="text-2xl font-bold text-blue-400">{report.insights.avg_ctr}%</p>
            <div className="flex items-center gap-1 mt-1">
              {report.insights.avg_ctr >= 5 ? (
                <span className="text-xs text-green-400">🔥 Excellent</span>
              ) : report.insights.avg_ctr >= 3 ? (
                <span className="text-xs text-blue-400">✅ Good</span>
              ) : (
                <span className="text-xs text-yellow-400">⚠️ Needs work</span>
              )}
            </div>
          </div>

          {/* Impressions */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Impressions</p>
            <p className="text-2xl font-bold text-purple-400">{report.insights.total_impressions?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{report.insights.impression_growth}</p>
          </div>

          {/* Conversions */}
          <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
            <p className="text-sm text-gray-400 mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-green-400">{report.insights.total_conversions?.toLocaleString() || 0}</p>
            <p className="text-xs text-gray-500 mt-1">{report.insights.conversion_growth}</p>
          </div>

          {/* ROAS */}
          {report.insights.roas > 0 && (
            <div className="p-4 bg-black/40 border border-white/5 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">ROAS</p>
              <p className="text-2xl font-bold text-yellow-400">{report.insights.roas}x</p>
              <p className="text-xs text-gray-500 mt-1">Return on ad spend</p>
            </div>
          )}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="p-6 rounded-xl mb-10 bg-black/30 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-[#a88fd8] mb-6 flex items-center gap-2">
          🤖 AI-Powered Recommendations
        </h2>

        {report.recommendations && report.recommendations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl border-l-4 ${getPriorityColor(rec.priority)} hover:shadow-lg transition-all`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`p-2 rounded-lg ${getPriorityBadge(rec.priority)}`}>
                      {getCategoryIcon(rec.category)}
                    </span>
                    <div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(rec.priority)}`}>
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  {rec.impact && (
                    <span className="text-xs text-[#a88fd8] bg-[#a88fd8]/10 px-2 py-1 rounded-full">
                      {rec.impact}
                    </span>
                  )}
                </div>

                {/* Content */}
                <h3 className="font-bold text-gray-100 mb-2">{rec.title}</h3>
                <p className="text-sm text-gray-300 leading-relaxed mb-3">{rec.description}</p>

                {/* Metrics */}
                {rec.metric && (
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-3 p-2 bg-black/30 rounded">
                    <div>
                      <span className="text-gray-500">Current:</span>
                      <span className="ml-1 text-gray-300">{rec.current}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <span className="ml-1 text-[#a88fd8]">{rec.target}</span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {rec.action && (
                  <button className="w-full mt-2 px-4 py-2 bg-[#a88fd8]/20 hover:bg-[#a88fd8]/30 
                    text-[#a88fd8] rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    {rec.action}
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-gray-400">Everything looks great! Keep up the good work.</p>
          </div>
        )}
      </div>

      {/* Next Steps */}
      <div className="p-6 rounded-xl bg-black/30 border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold text-[#a88fd8] mb-6 flex items-center gap-2">
          🎯 Next Steps
        </h2>

        <div className="space-y-3">
          {report.next_steps && report.next_steps.length > 0 ? (
            report.next_steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-black/40 border border-white/5 
                rounded-lg hover:border-[#a88fd8]/30 transition-colors group"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#a88fd8]/20 
                  flex items-center justify-center text-[#a88fd8] font-bold text-sm
                  group-hover:bg-[#a88fd8]/30 transition-colors">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-gray-200 leading-relaxed">{step}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-600 group-hover:text-[#a88fd8] transition-colors" />
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center py-4">No action items at this time</p>
          )}
        </div>
      </div>

      {/* Footer Note */}
      {report.comparison_available === false && (
        <div className="mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
          <p className="text-sm text-yellow-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>
              Not enough historical data for week-over-week comparison.
              Continue creating campaigns to see trend analysis.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}