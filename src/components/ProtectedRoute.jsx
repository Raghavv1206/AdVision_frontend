import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // User not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, render the app
  return children;
};

export default ProtectedRoute;