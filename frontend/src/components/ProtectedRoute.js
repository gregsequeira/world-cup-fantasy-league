// components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, requiredRole, requireVerified }) {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const verified = localStorage.getItem('verified') === 'true';

  // If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // If a role is required and user doesn't match → redirect home
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // If verification is required and user isn't verified → redirect home
  if (requireVerified && !verified) {
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected content
  return children;
}

export default ProtectedRoute;
