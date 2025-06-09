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
  search_vector?: any;
  is_draft?: boolean | null;
  auto_saved_at?: string | null;
  last_local_edit?: string | null;
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
          user_id: user.id,
          is_draft: false // Published entries are not drafts
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

  async autoSaveDraft(entryId: string | null, content: string): Promise<{ data: { id: string } | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      console.log("Auto-saving draft:", { entryId, contentLength: content.length });
      
      const { data, error } = await supabase.rpc('auto_save_draft', {
        p_entry_id: entryId,
        p_content: content,
        p_user_id: user.id
      });

      if (error) {
        console.error("Auto-save error:", error);
        return { data: null, error };
      }

      console.log("Draft auto-saved successfully:", data);
      return { data: { id: data }, error: null };
    } catch (error) {
      console.error("Unexpected error auto-saving draft:", error);
      return { data: null, error };
    }
  },

  async publishDraft(entryId: string): Promise<{ data: boolean | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      console.log("Publishing draft:", entryId);
      
      const { data, error } = await supabase.rpc('publish_draft', {
        p_entry_id: entryId
      });

      if (error) {
        console.error("Publish error:", error);
        return { data: null, error };
      }

      console.log("Draft published successfully:", data);
      return { data, error: null };
    } catch (error) {
      console.error("Unexpected error publishing draft:", error);
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
          updated_at: new Date().toISOString(),
          last_local_edit: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
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
        .eq('user_id', user.id)
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

  async getDrafts(): Promise<{ data: JournalEntry[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_draft', true)
        .order('auto_saved_at', { ascending: false });

      if (error) {
        console.error("Fetch drafts error:", error);
      }

      return { data, error };
    } catch (error) {
      console.error("Unexpected error fetching drafts:", error);
      return { data: null, error };
    }
  },

  async searchEntries(query: string): Promise<{ data: JournalEntry[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      if (!query.trim()) {
        // If no query, return all entries
        return this.getEntries();
      }

      const { data, error } = await supabase
        .from('journals')
        .select('*')
        .eq('user_id', user.id)
        .textSearch('search_vector', `'${query.trim()}'`, {
          type: 'websearch',
          config: 'french'
        })
        .order('updated_at', { ascending: false });

      if (error) {
        console.error("Search error:", error);
        // Fallback to simple content search if full-text search fails
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('journals')
          .select('*')
          .eq('user_id', user.id)
          .ilike('content', `%${query.trim()}%`)
          .order('updated_at', { ascending: false });
        
        return { data: fallbackData, error: fallbackError };
      }

      return { data, error };
    } catch (error) {
      console.error("Unexpected error searching entries:", error);
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
        .eq('user_id', user.id);

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
