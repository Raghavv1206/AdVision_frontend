// frontend/src/App.jsx - COMPLETE WITH ALL FEATURES
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Protected Pages
import DashboardPage from './pages/DashboardPage';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetailPage from './pages/CampaignDetailPage';
import ContentGeneratorPage from './pages/ContentGeneratorPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ContentLibraryPage from './pages/ContentLibraryPage';
import ProfilePage from './pages/ProfilePage';
import AudienceInsightsPage from './pages/AudienceInsightsPage';
import WeeklyReportPage from './pages/WeeklyReportPage';
import ABTestingPage from './pages/ABTestingPage';
import APIKeysPage from './pages/APIKeysPage';

// Layouts & Components
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import UnicornBackground from './components/UnicornBackground';

function App() {
  return (
    <>
      <Toaster
  position="top-right"
  reverseOrder={false}
  toastOptions={{
    duration: 3500,
    style: {
      background: 'rgba(22, 17, 29, 0.85)',
      color: '#EAEAEA',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(168, 143, 216, 0.2)',
      boxShadow: '0 0 15px rgba(168, 143, 216, 0.1)',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: 500,
      padding: '12px 16px',
    },
    success: {
      duration: 3000,
      style: {
        background: 'rgba(16, 185, 129, 0.15)',
        border: '1px solid rgba(16, 185, 129, 0.4)',
        color: '#A7F3D0',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
      },
      iconTheme: {
        primary: '#34D399',
        secondary: '#0F0C12',
      },
    },
    error: {
      duration: 4000,
      style: {
        background: 'rgba(239, 68, 68, 0.15)',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        color: '#FCA5A5',
        boxShadow: '0 0 12px rgba(239, 68, 68, 0.25)',
      },
      iconTheme: {
        primary: '#F87171',
        secondary: '#0F0C12',
      },
    },
    loading: {
      style: {
        background: 'rgba(168, 143, 216, 0.15)',
        border: '1px solid rgba(168, 143, 216, 0.4)',
        color: '#D9D3E8',
        boxShadow: '0 0 12px rgba(168, 143, 216, 0.25)',
      },
      iconTheme: {
        primary: '#A88FD8',
        secondary: '#0F0C12',
      },
    },
  }}
/>

      <BrowserRouter>
       {/* 🌀 Global background */}
        <UnicornBackground />
      
        <Routes>
          {/* ============================= */}
          {/* PUBLIC ROUTES                 */}
          {/* ============================= */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          
          {/* ============================= */}
          {/* PROTECTED APP ROUTES          */}
          {/* ============================= */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />
            
            {/* Campaigns */}
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="campaigns/:id" element={<CampaignDetailPage />} />
            
            {/* Content Generation */}
            <Route path="generator" element={<ContentGeneratorPage />} />
            
            {/* Content Library */}
            <Route path="library" element={<ContentLibraryPage />} />
            
            {/* Analytics */}
            <Route path="analytics" element={<AnalyticsPage />} />
            
            {/* NEW: Advanced Features */}
            <Route path="insights" element={<AudienceInsightsPage />} />
            <Route path="reports" element={<WeeklyReportPage />} />
            <Route path="ab-testing" element={<ABTestingPage />} />
            
            {/* Profile */}
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Redirect /app to /app/dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />
           <Route path="api-keys" element={<APIKeysPage />} />
          </Route>

          {/* ============================= */}
          {/* 404 NOT FOUND                 */}
          {/* ============================= */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
              <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">404</h1>
              <p className="text-gray-600 mb-4">Page Not Found</p>
              <a href="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Go Home
              </a>
            </div>
          } />
          
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;