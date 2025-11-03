"use client";

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../integrations/supabase/session-context';

const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Render a simple loading state while checking auth status
    return <div className="p-8 text-center">Loading authentication...</div>;
  }

  if (!user) {
    // Redirect unauthenticated users to the login page
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;