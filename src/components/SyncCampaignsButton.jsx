// frontend/src/components/SyncCampaignsButton.jsx
import React, { useState } from 'react';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

export default function SyncCampaignsButton({ onSyncComplete }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState(null);

  const handleSync = async () => {
    setIsSyncing(true);
    const toastId = toast.loading('Syncing campaigns from your ad platforms...');
    
    try {
      const response = await apiClient.post('/sync/campaigns/');
      
      if (response.data.success) {
        const { summary, results } = response.data;
        
        toast.success(
          `Synced successfully! ${summary.successful}/${summary.total_platforms} platforms`, 
          { id: toastId, duration: 5000 }
        );
        
        // Show detailed results
        setSyncStatus(results);
        
        // Call callback if provided
        if (onSyncComplete) {
          onSyncComplete(results);
        }
      } else {
        toast.error('Sync failed', { id: toastId });
      }
    } catch (error) {
      console.error('Sync error:', error);
      const errorMsg = error.response?.data?.error || 'Failed to sync campaigns';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleSync}
        disabled={isSyncing}
        className={`px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 transition-all ${
          isSyncing ? 'opacity-50 cursor-not-allowed' : 'hover:from-green-700 hover:to-blue-700'
        }`}
      >
        {isSyncing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Syncing...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Sync Campaigns
          </>
        )}
      </button>

      {/* Sync Results */}
      {syncStatus && (
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Sync Results:</p>
          {syncStatus.map((result, index) => (
            <div 
              key={index} 
              className={`text-sm p-3 rounded-lg ${
                result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {result.success ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
                <span className="font-medium">{result.platform}: {result.api_key_name}</span>
              </div>
              {result.success ? (
                <p className="ml-6 text-xs">✓ Synced {result.synced_campaigns} campaigns</p>
              ) : (
                <p className="ml-6 text-xs">✗ {result.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}