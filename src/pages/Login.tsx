"use client";

import React, { useEffect } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../integrations/supabase/session-context';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect authenticated users to the main page
      navigate('/');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center mb-6">Welcome to ProOmo</h2>
        <Auth
          supabaseClient={supabase}
          providers={['google', 'twitter']} // Using Google and X/Twitter as specified
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(222.2 47.4% 11.2%)', // Dark blue/black for primary actions
                  brandAccent: 'hsl(222.2 47.4% 20%)',
                },
              },
            },
          }}
          theme="light"
          redirectTo={window.location.origin}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your Password',
                button_label: 'Sign up',
                social_provider_text: 'Continue with {{provider}}',
                link_text: 'Don\'t have an account? Sign up',
              },
              sign_in: {
                email_label: 'Email address',
                password_label: 'Your Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your Password',
                button_label: 'Sign in',
                social_provider_text: 'Continue with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Login;