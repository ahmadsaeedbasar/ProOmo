"use client";

import React from 'react';
import { useAuth } from '../integrations/supabase/session-context';
import { Button } from '../components/ui/button';
import { supabase } from '../integrations/supabase/client';
import { LogOut } from 'lucide-react';

const Home: React.FC = () => {
  const { user, isLoading } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">ProOmo Marketplace</h1>
      
      {user ? (
        <div className="space-y-4">
          <p className="text-lg">Welcome back, {user.email}!</p>
          <p className="text-sm text-gray-500">User ID: {user.id}</p>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      ) : (
        <p className="text-lg">Please log in or register to access the dashboard.</p>
      )}
    </div>
  );
};

export default Home;