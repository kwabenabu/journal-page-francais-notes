
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  theme_preference?: 'light' | 'dark' | 'auto';
  language_preference?: 'en' | 'fr';
  writing_goal?: number;
  notifications_enabled?: boolean;
  created_at: string;
  updated_at: string;
}

export interface WritingStats {
  id: string;
  user_id: string;
  date: string;
  word_count: number;
  entries_written: number;
  total_accuracy_score: number;
  streak_count: number;
  created_at: string;
  updated_at: string;
}

export const profileService = {
  async getProfile(): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // No profile found, create one
        console.log("No profile found, creating one for user:", user.id);
        return await this.createProfile(user);
      }

      if (error) {
        return { data: null, error };
      }

      // Type cast the data to ensure proper typing
      const profile: UserProfile = {
        ...data,
        theme_preference: data.theme_preference as 'light' | 'dark' | 'auto',
        language_preference: data.language_preference as 'en' | 'fr'
      };

      return { data: profile, error: null };
    } catch (error) {
      console.error("Error fetching profile:", error);
      return { data: null, error };
    }
  },

  async createProfile(user: any): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const displayName = user.user_metadata?.display_name || 
                         user.email?.split('@')[0] || 
                         'User';

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          display_name: displayName,
          theme_preference: 'auto',
          language_preference: 'en',
          writing_goal: 300,
          notifications_enabled: true
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return { data: null, error };
      }

      console.log("Profile created successfully:", data);
      
      // Type cast the data to ensure proper typing
      const profile: UserProfile = {
        ...data,
        theme_preference: data.theme_preference as 'light' | 'dark' | 'auto',
        language_preference: data.language_preference as 'en' | 'fr'
      };

      return { data: profile, error: null };
    } catch (error) {
      console.error("Error creating profile:", error);
      return { data: null, error };
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<{ data: UserProfile | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { data: null, error };
      }

      // Type cast the data to ensure proper typing
      const profile: UserProfile = {
        ...data,
        theme_preference: data.theme_preference as 'light' | 'dark' | 'auto',
        language_preference: data.language_preference as 'en' | 'fr'
      };

      return { data: profile, error: null };
    } catch (error) {
      console.error("Error updating profile:", error);
      return { data: null, error };
    }
  },

  async getWritingStats(): Promise<{ data: WritingStats[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('writing_stats')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(30); // Last 30 days

      return { data, error };
    } catch (error) {
      console.error("Error fetching writing stats:", error);
      return { data: null, error };
    }
  }
};
