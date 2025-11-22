// frontend/src/pages/ABTestingPage.jsx
import React, { useState, useEffect } from "react";
import apiClient from "../api/client";
import toast from "react-hot-toast";
import {
  FlaskConical,
  Plus,
  BarChart3,
  PlayCircle,
  Brain,
  CheckCircle,
  X,
} from "lucide-react";

export default function ABTestingPage() {
  const [campaigns, setCampaigns] = useState([]);
  const [abTests, setAbTests] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newTest, setNewTest] = useState({
    name: "",
    description: "",
    success_metric: "ctr",
    variations: [
      { name: "A", ad_content_id: "", image_asset_id: "" },
      { name: "B", ad_content_id: "", image_asset_id: "" },
    ],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [campaignsRes, testsRes] = await Promise.all([
        apiClient.get("/campaigns/"),
        apiClient.get("/ab-tests/"),
      ]);
      setCampaigns(campaignsRes.data);
      setAbTests(testsRes.data);
    } catch (error) {
      toast.error("Failed to load A/B tests");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Creating A/B test...");

    try {
      await apiClient.post("/ab-tests/create/", {
        campaign_id: selectedCampaign,
        ...newTest,
      });

      toast.success("A/B test created!", { id: toastId });
      setShowCreateModal(false);
      fetchData();
    } catch (error) {
      toast.error("Failed to create test", { id: toastId });
    }
  };

  const handleStartTest = async (testId) => {
    const toastId = toast.loading("Starting test...");
    try {
      await apiClient.post(`/ab-tests/${testId}/start/`);
      toast.success("Test started!", { id: toastId });
      fetchData();
    } catch (error) {
      toast.error("Failed to start test", { id: toastId });
    }
  };

  const handleAnalyzeTest = async (testId) => {
    const toastId = toast.loading("Analyzing results...");
    try {
      const response = await apiClient.get(`/ab-tests/${testId}/analyze/`);

      if (response.data.analysis.status === "completed") {
        toast.success(
          `Winner: Variation ${response.data.analysis.winner}!`,
          { id: toastId }
        );
      } else {
        toast.info(response.data.analysis.message, { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to analyze test", { id: toastId });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a88fd8]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white p-4 md:p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide flex items-center gap-2">
            <FlaskConical className="w-7 h-7 text-[#a88fd8]" /> A/B Testing
          </h1>
          <p className="text-gray-400 text-sm md:text-base mt-1">
            Experiment with variations and optimize your ad performance
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] hover:brightness-110 text-white rounded-lg flex items-center gap-2 shadow-lg transition-all self-start md:self-auto"
        >
          <Plus className="w-5 h-5" /> Create A/B Test
        </button>
      </div>

      {/* Tests List */}
      {abTests.length === 0 ? (
        <div className="text-center py-16 md:py-20 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(189,168,200,0.15)]">
          <BarChart3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-sm md:text-base">
            No A/B tests yet. Click{" "}
            <span className="text-[#a88fd8] font-medium">"Create A/B Test"</span>{" "}
            to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {abTests.map((test) => (
            <div
              key={test.id}
              className="p-5 md:p-6 rounded-xl bg-black/30 border border-white/10 hover:bg-[#a88fd8]/10 transition-all duration-300 shadow hover:shadow-[0_0_15px_rgba(189,168,200,0.3)]"
            >
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                
                {/* Test Info */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-[#a88fd8] mb-1">
                    {test.name}
                  </h3>
                  <p className="text-gray-300 text-sm mb-2">
                    {test.description || "No description provided."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                    <span
                      className={`px-2 py-1 rounded-full capitalize ${
                        test.status === "running"
                          ? "bg-green-500/20 text-green-400"
                          : test.status === "completed"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-600/20 text-gray-300"
                      }`}
                    >
                      {test.status}
                    </span>

                    <span className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      Metric: {test.success_metric.toUpperCase()}
                    </span>

                    {test.winner && (
                      <span className="flex items-center gap-1 text-green-400 font-medium">
                        <CheckCircle className="w-4 h-4" />
                        Winner: {test.winner}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 self-start sm:self-auto">
                  {test.status === "draft" && (
                    <button
                      onClick={() => handleStartTest(test.id)}
                      className="px-3 py-1.5 bg-green-600/70 hover:bg-green-700 text-white rounded-lg text-xs md:text-sm"
                    >
                      <PlayCircle className="w-4 h-4 inline-block mr-1" />
                      Start
                    </button>
                  )}

                  {test.status === "running" && (
                    <button
                      onClick={() => handleAnalyzeTest(test.id)}
                      className="px-3 py-1.5 bg-blue-600/70 hover:bg-blue-700 text-white rounded-lg text-xs md:text-sm"
                    >
                      <BarChart3 className="w-4 h-4 inline-block mr-1" />
                      Analyze
                    </button>
                  )}
                </div>
              </div>

              {/* Variations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {test.variations?.map((v) => (
                  <div
                    key={v.id}
                    className={`p-4 rounded-lg border ${
                      test.winner === v.name
                        ? "border-green-400 bg-green-400/10"
                        : "border-white/10 bg-black/30"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-lg text-white">
                        Variation {v.name}
                      </span>

                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          test.winner === v.name
                            ? "bg-green-500/20 text-green-400"
                            : "bg-gray-700/30 text-gray-400"
                        }`}
                      >
                        {test.winner === v.name ? "Winner" : "Testing"}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-300">
                      <div className="flex justify-between">
                        <span>Impressions:</span>
                        <span className="font-semibold">
                          {v.impressions.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>Clicks:</span>
                        <span className="font-semibold">
                          {v.clicks.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span>CTR:</span>
                        <span className="font-semibold">{v.ctr}%</span>
                      </div>

                      <div className="flex justify-between">
                        <span>Conversions:</span>
                        <span className="font-semibold">{v.conversions}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create A/B Test Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto py-10">
          <div className="bg-[#1c1624] border border-white/10 p-6 md:p-8 rounded-xl shadow-2xl w-[95%] max-w-2xl relative max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-xl md:text-2xl font-semibold text-[#BDA8C8] mb-6">
              Create A/B Test
            </h2>

            {/* FORM */}
            <form onSubmit={handleCreateTest} className="space-y-5">
              {/* Campaign */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Campaign
                </label>
                <select
                  value={selectedCampaign}
                  onChange={(e) => setSelectedCampaign(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                >
                  <option value="">Select Campaign</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Test Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Test Name
                </label>
                <input
                  type="text"
                  value={newTest.name}
                  onChange={(e) =>
                    setNewTest({ ...newTest, name: e.target.value })
                  }
                  required
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTest.description}
                  onChange={(e) =>
                    setNewTest({ ...newTest, description: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                />
              </div>

              {/* Metric */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">
                  Success Metric
                </label>
                <select
                  value={newTest.success_metric}
                  onChange={(e) =>
                    setNewTest({ ...newTest, success_metric: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                >
                  <option value="ctr">Click-Through Rate (CTR)</option>
                  <option value="conversion_rate">Conversion Rate</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-600/30 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-all w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white rounded-lg hover:brightness-110 transition-all w-full sm:w-auto"
                >
                  Create Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
