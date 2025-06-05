
import { supabase } from "@/integrations/supabase/client";

export interface JournalEntry {
  id: string;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const journalService = {
  async saveEntry(content: string): Promise<{ data: JournalEntry | null; error: any }> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { data: null, error: { message: "User not authenticated" } };
    }

    const { data, error } = await supabase
      .from('journals')
      .insert([{
        content,
        user_id: user.id
      }])
      .select()
      .single();

    return { data, error };
  },

  async updateEntry(id: string, content: string): Promise<{ data: JournalEntry | null; error: any }> {
    const { data, error } = await supabase
      .from('journals')
      .update({ 
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    return { data, error };
  },

  async getEntries(): Promise<{ data: JournalEntry[] | null; error: any }> {
    const { data, error } = await supabase
      .from('journals')
      .select('*')
      .order('updated_at', { ascending: false });

    return { data, error };
  },

  async deleteEntry(id: string): Promise<{ error: any }> {
    const { error } = await supabase
      .from('journals')
      .delete()
      .eq('id', id);

    return { error };
  }
};
