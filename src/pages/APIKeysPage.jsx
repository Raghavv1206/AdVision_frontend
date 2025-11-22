// C:\Users\ragha\project\advision-project\frontend\src\pages\APIKeysPage.jsx
import React, { useState, useEffect } from 'react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

export default function APIKeysPage() {
  const [apiKeys, setApiKeys] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [newKey, setNewKey] = useState({
    api_type: 'google_ads',
    api_name: '',
    api_key: '',
    api_secret: '',
    account_id: '',
    developer_token: ''
  });

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/api-keys/');
      setApiKeys(response.data.api_keys || []);
    } catch (error) {
      toast.error('Failed to load API keys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKey = async (e) => {
    e.preventDefault();

    if (!newKey.api_name.trim()) return toast.error('Please enter a friendly name');
    if (!newKey.api_key.trim()) return toast.error('Please enter an API key');

    const toastId = toast.loading('Adding API key...');

    try {
      await apiClient.post('/api-keys/create/', newKey);
      toast.success('API key added successfully!', { id: toastId });
      setShowAddModal(false);

      setNewKey({
        api_type: 'google_ads',
        api_name: '',
        api_key: '',
        api_secret: '',
        account_id: '',
        developer_token: ''
      });

      fetchAPIKeys();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to add API key', { id: toastId });
    }
  };

  const handleDeleteKey = async (keyId) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;

    const toastId = toast.loading('Deleting...');

    try {
      await apiClient.delete(`/api-keys/${keyId}/delete/`);
      toast.success('API key deleted', { id: toastId });
      fetchAPIKeys();
    } catch (error) {
      toast.error('Failed to delete', { id: toastId });
    }
  };

  const handleVerifyKey = async (keyId) => {
    const toastId = toast.loading('Verifying...');

    try {
      const response = await apiClient.post(`/api-keys/${keyId}/verify/`);
      if (response.data.verification_status === 'verified') {
        toast.success('API key verified!', { id: toastId });
      } else {
        toast.error('Verification failed', { id: toastId });
      }
      fetchAPIKeys();
    } catch (error) {
      toast.error('Verification failed', { id: toastId });
    }
  };

  const handleToggleKey = async (keyId) => {
    try {
      const response = await apiClient.patch(`/api-keys/${keyId}/toggle/`);
      toast.success(response.data.message);
      fetchAPIKeys();
    } catch {
      toast.error('Failed to toggle');
    }
  };

  const getAPITypeInfo = (type) => {
    const info = {
      google_ads: { name: 'Google Ads', icon: '🔍', color: '#4285F4' },
      facebook_ads: { name: 'Facebook Ads', icon: '📘', color: '#1877F2' },
      instagram_ads: { name: 'Instagram Ads', icon: '📸', color: '#E4405F' },
      tiktok_ads: { name: 'TikTok Ads', icon: '🎵', color: '#000000' },
      linkedin_ads: { name: 'LinkedIn Ads', icon: '💼', color: '#0A66C2' },
    };
    return info[type] || { name: type, icon: '🔑', color: '#a88fd8' };
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a88fd8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c12] via-[#16111d] to-[#0d0b11] text-white px-4 md:px-6 py-10">
      
      {/* Header Responsive */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">
            API Key Management
          </h1>
          <p className="text-gray-400 mt-1 text-sm md:text-base">
            Manage ad platform connections securely
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 w-full sm:w-auto text-center bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white 
          rounded-lg hover:brightness-110 transition-all duration-200 shadow-lg"
        >
          + Add API Key
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-[#a88fd8]/10 border border-[#a88fd8]/20 rounded-xl p-4 sm:p-5 mb-8 backdrop-blur-md">
        <h3 className="font-semibold text-[#cbb5e6] mb-1 text-sm sm:text-base">🔒 Your Data is Secure</h3>
        <p className="text-xs sm:text-sm text-gray-300">
          API keys are encrypted and safely stored. You can revoke or deactivate them anytime.
        </p>
      </div>

      {/* API Keys List */}
      {apiKeys.length === 0 ? (
        <div className="text-center py-16 bg-black/40 border border-white/10 rounded-xl backdrop-blur-md px-4">
          <div className="text-5xl mb-4">🔑</div>
          <h3 className="text-lg font-medium text-gray-300">No API Keys Added Yet</h3>
          <p className="text-sm text-gray-500 mb-6">Connect your first API key to start syncing data.</p>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] rounded-lg hover:brightness-110 transition-all"
          >
            Add Your First Key
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {apiKeys.map((key) => {
            const typeInfo = getAPITypeInfo(key.api_type);

            return (
              <div
                key={key.id}
                className="p-5 sm:p-6 rounded-xl bg-[#1a1522]/80 border border-white/10 shadow-md 
                hover:border-[#a88fd8]/40 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">

                  {/* Icon + Info */}
                  <div className="flex gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                      style={{ backgroundColor: `${typeInfo.color}33` }}
                    >
                      {typeInfo.icon}
                    </div>

                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-[#a88fd8] break-words">
                        {key.api_name}
                      </h3>

                      <p className="text-sm text-gray-400">{typeInfo.name}</p>

                      <div className="flex flex-wrap gap-2 mt-2 text-xs">
                        <span className={`px-2 py-0.5 rounded-full ${
                          key.verification_status === 'verified'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-300'
                        }`}>
                          {key.verification_status}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full ${
                          key.is_active
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-600/20 text-gray-400'
                        }`}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      {key.account_id && (
                        <p className="text-xs text-gray-500 mt-2 break-all">
                          Account ID: {key.account_id}
                        </p>
                      )}

                      <p className="text-xs text-gray-500 mt-1">
                        Added {new Date(key.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2">
                    <button
                      onClick={() => handleVerifyKey(key.id)}
                      className="p-2 hover:bg-[#a88fd8]/20 rounded-lg transition-all text-lg"
                      title="Verify Key"
                    >
                      ✅
                    </button>

                    <button
                      onClick={() => handleToggleKey(key.id)}
                      className="p-2 hover:bg-[#a88fd8]/20 rounded-lg transition-all text-lg"
                      title={key.is_active ? 'Deactivate' : 'Activate'}
                    >
                      ⚡
                    </button>

                    <button
                      onClick={() => handleDeleteKey(key.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-all text-lg"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add API Key Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-[#1c1624] border border-white/10 rounded-xl shadow-2xl 
          w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-[#cbb5e6]">
                Add API Key
              </h2>

              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddKey} className="space-y-4">

              {/* Platform */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Platform *</label>
                <select
                  value={newKey.api_type}
                  onChange={(e) => setNewKey({ ...newKey, api_type: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg 
                  focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                  required
                >
                  <option value="google_ads">Google Ads</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="instagram_ads">Instagram Ads</option>
                  <option value="tiktok_ads">TikTok Ads</option>
                  <option value="linkedin_ads">LinkedIn Ads</option>
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">Friendly Name *</label>
                <input
                  type="text"
                  value={newKey.api_name}
                  onChange={(e) => setNewKey({ ...newKey, api_name: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg 
                  focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                  placeholder="e.g., Main Google Ads Account"
                  required
                />
              </div>

              {/* API Key */}
              <div>
                <label className="block text-sm text-gray-300 mb-1">API Key *</label>
                <input
                  type="password"
                  value={newKey.api_key}
                  onChange={(e) => setNewKey({ ...newKey, api_key: e.target.value })}
                  className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg 
                  focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                  placeholder="Enter your API key"
                  required
                />
              </div>

              {/* Developer Token (only for Google Ads) */}
              {newKey.api_type === 'google_ads' && (
                <div>
                  <label className="block text-sm text-gray-300 mb-1">Developer Token</label>
                  <input
                    type="password"
                    value={newKey.developer_token}
                    onChange={(e) => setNewKey({ ...newKey, developer_token: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 border border-gray-700 rounded-lg 
                    focus:ring-2 focus:ring-[#a88fd8] text-white text-sm"
                    placeholder="Google Ads Developer Token"
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-700 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-700/40 text-gray-300 rounded-lg 
                  hover:bg-gray-600/60 transition w-full sm:w-auto"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-[#3a3440] to-[#a88fd8] text-white rounded-lg 
                  hover:brightness-110 transition w-full sm:w-auto"
                >
                  Add & Verify
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
