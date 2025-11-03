"use client";

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth } from '../integrations/supabase/session-context';
import { User, Briefcase, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../integrations/supabase/client';
import toast from 'react-hot-toast';
import ProfileSetupPage from '../pages/ProfileSetupPage';
import DashboardOverview from '../pages/DashboardOverview';

const Sidebar: React.FC = () => {
  const { profile } = useAuth();
  
  // Simple role check: if niche is set, assume creator profile is being built/used
  const isCreator = !!profile?.niche; 
  
  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
    { to: '/dashboard/profile', icon: User, label: 'Profile' },
    ...(isCreator ? [
      { to: '/dashboard/offers', icon: Briefcase, label: 'Offers' },
      { to: '/dashboard/requests', icon: Briefcase, label: 'Requests' },
    ] : [
      { to: '/dashboard/requests', icon: Briefcase, label: 'Sent Requests' },
    ]),
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully.');
  };

  return (
    <div className="w-64 bg-gray-50 border-r p-4 flex flex-col h-full min-h-screen">
      <h2 className="text-xl font-bold mb-6 text-gray-800">ProOmo Dashboard</h2>
      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center p-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-red-600 hover:bg-red-50/50">
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

const DashboardLayout: React.FC = () => {
  const { profile, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  // Check if the profile is minimally complete (e.g., has a first name)
  const isProfileComplete = profile && profile.first_name;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-white">
        {isProfileComplete ? (
          <Routes>
            <Route index element={<DashboardOverview />} />
            <Route path="profile" element={<ProfileSetupPage />} />
            {/* Future routes: /offers, /requests */}
            <Route path="*" element={<div className="text-center p-10">404 - Dashboard Page Not Found</div>} />
          </Routes>
        ) : (
          <ProfileSetupPage />
        )}
      </main>
    </div>
  );
};

export default DashboardLayout;