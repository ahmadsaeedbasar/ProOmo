// Define common interfaces here that can be used by both frontend and backend (if applicable)
// For now, we'll keep it minimal, but this is where shared data structures would live.

export interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  niche: string | null;
  location: string | null;
  instagram_url: string | null;
  youtube_url: string | null;
  x_url: string | null;
  tiktok_url: string | null;
  bio: string | null;
  is_verified: boolean;
  updated_at: string;
}

export type UserRole = 'creator' | 'brand' | 'admin';

// Add more shared types as the application grows