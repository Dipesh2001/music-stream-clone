import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectIsAuthenticated, selectCurrentUser } from '../store/slices/authSlice';
import type { Role } from '../types/auth.types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);

  console.log('ProtectedRoute rendered. isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute rendered. User:', user);

  if (!isAuthenticated) {
    // Not authenticated, redirect to login page
    console.log('Not authenticated, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Authenticated but not authorized, redirect to an unauthorized page or dashboard
    // For now, let's redirect to dashboard if not authorized
    return <Navigate to="/dashboard" replace />;
  }

  // Authenticated and authorized
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
