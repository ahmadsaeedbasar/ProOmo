"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '../integrations/supabase/session-context';
import { supabase } from '../integrations/supabase/client';
import toast from 'react-hot-toast';
import { Profile } from '../types/database';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const ProfileSetupPage: React.FC = () => {
  const { user, profile, refetchProfile } = useAuth();
  const [formData, setFormData] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        niche: profile.niche || '',
        location: profile.location || '',
        instagram_url: profile.instagram_url || '',
        youtube_url: profile.youtube_url || '',
        x_url: profile.x_url || '',
        tiktok_url: profile.tiktok_url || '',
      });
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Basic validation for required fields
    if (!formData.first_name || !formData.last_name) {
      toast.error('First Name and Last Name are required.');
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading('Saving profile...');

    const updateData = {
      ...formData,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id);

    toast.dismiss(loadingToast);
    setIsSaving(false);

    if (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to save profile: ' + error.message);
    } else {
      toast.success('Profile saved successfully!');
      refetchProfile(); // Update context state
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {profile?.first_name ? 'Edit Profile' : 'Complete Your Profile'}
      </h1>
      <p className="mb-8 text-gray-600">
        Please fill out your details to start using the ProOmo marketplace.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input id="first_name" value={formData.first_name || ''} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input id="last_name" value={formData.last_name || ''} onChange={handleChange} required />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea id="bio" value={formData.bio || ''} onChange={handleChange} rows={4} placeholder="Tell us about yourself..." />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={formData.location || ''} onChange={handleChange} placeholder="e.g., New York, USA" />
          </div>
          <div>
            <Label htmlFor="niche">Niche (e.g., Gaming, Beauty, Finance)</Label>
            <Input id="niche" value={formData.niche || ''} onChange={handleChange} placeholder="Required for Creators" />
          </div>
        </div>

        <h3 className="text-xl font-semibold pt-4">Social Links (Optional)</h3>
        <div className="space-y-4">
          <Input id="instagram_url" value={formData.instagram_url || ''} onChange={handleChange} placeholder="Instagram URL" />
          <Input id="youtube_url" value={formData.youtube_url || ''} onChange={handleChange} placeholder="YouTube URL" />
          <Input id="x_url" value={formData.x_url || ''} onChange={handleChange} placeholder="X (Twitter) URL" />
          <Input id="tiktok_url" value={formData.tiktok_url || ''} onChange={handleChange} placeholder="TikTok URL" />
        </div>

        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Profile'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSetupPage;