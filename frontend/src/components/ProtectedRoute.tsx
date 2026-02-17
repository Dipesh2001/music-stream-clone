import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectCurrentAccessToken, selectCurrentUser } from '../store/slices/authSlice';
import type { Role } from '../types/auth.types';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const accessToken = useSelector(selectCurrentAccessToken);
  const user = useSelector(selectCurrentUser);

  console.log('ProtectedRoute rendered. Access Token:', accessToken ? 'Present' : 'Absent');
  console.log('ProtectedRoute rendered. User:', user);

  if (!accessToken) {
    // Not authenticated, redirect to login page
    console.log('No access token, redirecting to /login');
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
