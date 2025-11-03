export interface Profile {
  id: string; // References auth.users.id
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
  updated_at: string | null;
}

export interface Offer {
  id: string;
  user_id: string;
  title: string;
  type: 'story' | 'post' | 'header' | 'bio_mention' | 'custom';
  description: string | null;
  price_cents: number;
  currency: string;
  duration_days: number;
  availability: boolean;
  created_at: string;
}

export interface ContactRequest {
  id: string;
  brand_id: string;
  creator_profile_id: string;
  offer_id: string | null;
  message: string;
  status: 'sent' | 'read' | 'accepted' | 'rejected' | 'completed';
  attachments: any | null; // JSONB
  created_at: string;
}