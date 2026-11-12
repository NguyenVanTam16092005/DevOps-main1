import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getRoleHome, useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to={getRoleHome(currentUser.role)} replace />;
  }

  return children;
};

export default ProtectedRoute;
