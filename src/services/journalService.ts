
import { supabase } from "@/integrations/supabase/client";

export interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  french_accuracy_score?: number | null;
  language_feedback?: string | null;
  reviewed_at?: string | null;
}

export const journalService = {
  async saveEntry(content: string): Promise<{ data: JournalEntry | null; error: any }> {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error("Auth error:", authError);
        return { data: null, error: authError };
      }
      
      if (!user) {
        console.error("No authenticated user found");
        return { data: null, error: { message: "User not authenticated" } };
      }

      console.log("Saving entry for user:", user.id);
      
      const { data, error } = await supabase
        .from('journals')
        .insert([{
          content,
          user_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        return { data: null, error };
      }

      console.log("Entry saved successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error saving entry:", error);
      return { data: null, error };
    }
  },

  async updateEntry(id: string, content: string): Promise<{ data: JournalEntry | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('journals')
        .update({ 
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id) // Ensure user can only update their own entries
        .select()
        .single();

      if (error) {
        console.error("Update error:", error);
      }

      return { data, error };
    } catch (error) {
      console.error("Unexpected error updating entry:", error);
      return { data: null, error };
    }
  },

  async getEntries(): Promise<{ data: JournalEntry[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id) // Only get user's own entries
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Fetch error:", error);
      }

      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching entries:", error);
      return { data: null, error };
    }
  },

  async deleteEntry(id: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: { message: "User not authenticated" } };
      }

      const { error } = await supabase
        .from('journals')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id); // Ensure user can only delete their own entries

      return { error };
    } catch (error) {
      console.error("Unexpected error deleting entry:", error);
      return { error };
    }
  },

  async requestFrenchReview(entryId: string, content: string): Promise<{ data: any; error: any }> {
    try {
      const { data, error } = await supabase.functions.invoke('review-french-entry', {
        body: { entryId, content }
      });

      if (error) {
        console.error('Edge function error:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Request review error:', error);
      return { data: null, error };
    }
  }
};
