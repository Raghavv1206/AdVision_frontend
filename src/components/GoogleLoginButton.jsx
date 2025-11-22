// frontend/src/components/GoogleLoginButton.jsx
import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import toast from 'react-hot-toast';

export default function GoogleLoginButton() {
  const navigate = useNavigate();

  const handleLogin = async (googleResponse) => {
    const toastId = toast.loading('Logging in with Google...');
    try {
      // Send the authorization code to backend
      const res = await apiClient.post('/auth/google/', {
        code: googleResponse.code,
      });

      // Store the JWT tokens
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('refresh_token', res.data.refresh);
      
      toast.success('Logged in successfully!', { id: toastId });
      navigate('/app/dashboard');

    } catch (err) {
      console.error('Google login error:', err.response?.data || err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.non_field_errors?.[0] || 
                          'Google login failed. Please try again.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleLogin,
    onError: (err) => {
      console.error('Google OAuth error:', err);
      toast.error('Google login failed. Please try again.');
    },
    flow: 'auth-code',
    // The redirect URI is handled automatically by @react-oauth/google
    // It uses the current origin (works for both localhost and production)
  });

  return (
    <button
      onClick={() => login()}
      type="button"
      className="w-full py-2.5 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-black/40 transition-colors"
    >
      <img 
        src="https://www.svgrepo.com/show/475656/google-color.svg" 
        alt="Google" 
        className="w-5 h-5" 
      />
      <span className="text-white/70 font-medium">Sign in with Google</span>
    </button>
  );
}