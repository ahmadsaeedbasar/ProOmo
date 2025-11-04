"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/components/SessionContextProvider";
import { UserProfileService, UserProfile } from "@/lib/supabase-service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { session, supabase } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    bio: "",
    instagram_handle: "",
    tiktok_handle: "",
    youtube_handle: "",
    twitter_handle: "",
    company_name: "",
    industry: "",
    company_website: "",
    user_type: "creator" as "creator" | "brand"
  });

  useEffect(() => {
    if (session) {
      loadProfile();
    }
  }, [session]);

  const loadProfile = async () => {
    try {
      const userProfile = await UserProfileService.getCurrentUserProfile();
      if (userProfile) {
        setProfile(userProfile);
        setFormData({
          full_name: userProfile.full_name || "",
          bio: userProfile.bio || "",
          instagram_handle: userProfile.instagram_handle || "",
          tiktok_handle: userProfile.tiktok_handle || "",
          youtube_handle: userProfile.youtube_handle || "",
          twitter_handle: userProfile.twitter_handle || "",
          company_name: userProfile.company_name || "",
          industry: userProfile.industry || "",
          company_website: userProfile.company_website || "",
          user_type: userProfile.user_type
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    try {
      const updatedProfile = await UserProfileService.updateProfile(formData);
      if (updatedProfile) {
        setProfile(updatedProfile);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-4">Please log in to view your profile.</p>
          <Button asChild>
            <Link href="/auth/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-red-600">Profile not found. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-purple-800">My Profile</h1>
            <div className="flex gap-4">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              )}
              <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    User Type
                  </label>
                  <select
                    name="user_type"
                    value={formData.user_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="creator">Creator</option>
                    <option value="brand">Brand</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {formData.user_type === "creator" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        name="instagram_handle"
                        value={formData.instagram_handle}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        TikTok Handle
                      </label>
                      <input
                        type="text"
                        name="tiktok_handle"
                        value={formData.tiktok_handle}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        YouTube Channel
                      </label>
                      <input
                        type="text"
                        name="youtube_handle"
                        value={formData.youtube_handle}
                        onChange={handleInputChange}
                        placeholder="Channel name or URL"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Twitter Handle
                      </label>
                      <input
                        type="text"
                        name="twitter_handle"
                        value={formData.twitter_handle}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}

                {formData.user_type === "brand" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company_name"
                        value={formData.company_name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Website
                      </label>
                      <input
                        type="url"
                        name="company_website"
                        value={formData.company_website}
                        onChange={handleInputChange}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit">Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-purple-600">
                    {profile.full_name?.charAt(0) || profile.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {profile.full_name || "No name provided"}
                  </h2>
                  <p className="text-gray-600">{profile.email}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                    profile.user_type === "creator" 
                      ? "bg-purple-100 text-purple-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {profile.user_type === "creator" ? "Creator" : "Brand"}
                  </span>
                </div>
              </div>

              {profile.bio && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Bio</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {profile.user_type === "creator" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Social Media</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.instagram_handle && (
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">📷</span>
                        <span className="text-gray-700">{profile.instagram_handle}</span>
                      </div>
                    )}
                    {profile.tiktok_handle && (
                      <div className="flex items-center gap-2">
                        <span className="text-black">🎵</span>
                        <span className="text-gray-700">{profile.tiktok_handle}</span>
                      </div>
                    )}
                    {profile.youtube_handle && (
                      <div className="flex items-center gap-2">
                        <span className="text-red-500">📺</span>
                        <span className="text-gray-700">{profile.youtube_handle}</span>
                      </div>
                    )}
                    {profile.twitter_handle && (
                      <div className="flex items-center gap-2">
                        <span className="text-blue-500">🐦</span>
                        <span className="text-gray-700">{profile.twitter_handle}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {profile.user_type === "brand" && (
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.company_name && (
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="text-gray-700 ml-2">{profile.company_name}</span>
                      </div>
                    )}
                    {profile.industry && (
                      <div>
                        <span className="text-gray-500">Industry:</span>
                        <span className="text-gray-700 ml-2">{profile.industry}</span>
                      </div>
                    )}
                    {profile.company_website && (
                      <div className="md:col-span-2">
                        <span className="text-gray-500">Website:</span>
                        <a 
                          href={profile.company_website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 ml-2"
                        >
                          {profile.company_website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.followers_count}</div>
                  <div className="text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.following_count}</div>
                  <div className="text-gray-600">Following</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}