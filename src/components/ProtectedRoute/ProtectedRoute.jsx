// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';

const ProtectedRoute = ({ children }) => {
  const { user, isAdmin, loading } = useAuthStatus();

  if (loading) return <p>Loading...</p>;

  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
