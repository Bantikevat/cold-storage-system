import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check for both email and JWT token for better security
  const isAuthenticated = !!localStorage.getItem('adminEmail') && !!localStorage.getItem('adminToken');

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
