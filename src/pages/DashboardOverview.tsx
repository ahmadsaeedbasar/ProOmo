"use client";

import React from 'react';
import { useAuth } from '../integrations/supabase/session-context';

const DashboardOverview: React.FC = () => {
  const { profile } = useAuth();
  
  const role = profile?.niche ? 'Creator' : 'Brand';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Welcome, {profile?.first_name || 'User'}!</h1>
      <p className="text-lg text-gray-600">You are currently logged in as a {role}.</p>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <p>Metrics and recent activity will appear here.</p>
      </div>
    </div>
  );
};

export default DashboardOverview;