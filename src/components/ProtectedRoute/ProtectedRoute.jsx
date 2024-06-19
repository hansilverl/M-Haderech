import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../../hooks/useAuthStatus';

const ProtectedRoute = ({ children, admin }) => {
  const { user, isAdmin, loading } = useAuthStatus();

  if (loading) return <p>Loading...</p>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (admin && !isAdmin) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
