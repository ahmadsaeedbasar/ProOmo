import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  user_type: 'creator' | 'brand';
  bio: string | null;
  followers_count: number;
  following_count: number;
  created_at: string;
  updated_at: string;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  twitter_handle: string | null;
  company_name: string | null;
  industry: string | null;
  company_website: string | null;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  brand_id: string;
  creator_id: string | null;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  budget: number | null;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  campaign_id: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'message' | 'campaign' | 'system';
  read: boolean;
  created_at: string;
}

// User Profile Service
export class UserProfileService {
  // Get current user's profile
  static async getCurrentUserProfile(): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
    return data;
  }

  // Update user profile
  static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }
    return data;
  }

  // Get user profiles by type
  static async getUsersByType(userType: 'creator' | 'brand'): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_type', userType)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users by type:', error);
      return [];
    }
    return data || [];
  }

  // Search users
  static async searchUsers(query: string): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching users:', error);
      return [];
    }
    return data || [];
  }
}

// Campaign Service
export class CampaignService {
  // Get campaigns
  static async getCampaigns(): Promise<Campaign[]> {
    const { data, error } = await supabase
      .from('campaigns')
      .select(`
        *,
        brand:user_profiles!campaigns_brand_id_fkey(*),
        creator:user_profiles!campaigns_creator_id_fkey(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching campaigns:', error);
      return [];
    }
    return data || [];
  }

  // Create campaign
  static async createCampaign(campaign: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .insert(campaign)
      .select()
      .single();

    if (error) {
      console.error('Error creating campaign:', error);
      return null;
    }
    return data;
  }

  // Update campaign
  static async updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating campaign:', error);
      return null;
    }
    return data;
  }
}

// Message Service
export class MessageService {
  // Get messages for user
  static async getMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:user_profiles!messages_sender_id_fkey(*),
        receiver:user_profiles!messages_receiver_id_fkey(*)
      `)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
    return data || [];
  }

  // Send message
  static async sendMessage(message: Omit<Message, 'id' | 'created_at'>): Promise<Message | null> {
    const { data, error } = await supabase
      .from('messages')
      .insert(message)
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      return null;
    }
    return data;
  }
}

// Notification Service
export class NotificationService {
  // Get notifications for user
  static async getNotifications(): Promise<Notification[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data || [];
  }

  // Mark notification as read
  static async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Create notification
  static async createNotification(notification: Omit<Notification, 'id' | 'created_at'>): Promise<Notification | null> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      return null;
    }
    return data;
  }
}

// File upload utility
export class StorageService {
  static async uploadFile(file: File, path: string): Promise<string | null> {
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(path, file);

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    return data.path;
  }

  static async getPublicUrl(path: string): Promise<string | null> {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);

    return data?.publicUrl || null;
  }
}

// Authentication utilities
export class AuthService {
  static async signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  static async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  }

  static async updatePassword(password: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      console.error('Error updating password:', error);
      throw error;
    }
  }
}