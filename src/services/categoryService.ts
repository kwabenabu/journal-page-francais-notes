
import { supabase } from "@/integrations/supabase/client";

export interface Category {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface JournalCategory {
  id: string;
  journal_id: string;
  category_id: string;
  created_at: string;
}

export const categoryService = {
  async getCategories(): Promise<{ data: Category[] | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      return { data, error };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { data: null, error };
    }
  },

  async createCategory(name: string, color: string = '#3B82F6'): Promise<{ data: Category | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name,
          color,
          user_id: user.id
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error creating category:", error);
      return { data: null, error };
    }
  },

  async updateCategory(id: string, name: string, color: string): Promise<{ data: Category | null; error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { data: null, error: { message: "User not authenticated" } };
      }

      const { data, error } = await supabase
        .from('categories')
        .update({ 
          name,
          color,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error updating category:", error);
      return { data: null, error };
    }
  },

  async deleteCategory(id: string): Promise<{ error: any }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return { error: { message: "User not authenticated" } };
      }

      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      return { error };
    } catch (error) {
      console.error("Error deleting category:", error);
      return { error };
    }
  },

  async addCategoryToJournal(journalId: string, categoryId: string): Promise<{ data: JournalCategory | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('journal_categories')
        .insert([{
          journal_id: journalId,
          category_id: categoryId
        }])
        .select()
        .single();

      return { data, error };
    } catch (error) {
      console.error("Error adding category to journal:", error);
      return { data: null, error };
    }
  },

  async removeCategoryFromJournal(journalId: string, categoryId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('journal_categories')
        .delete()
        .eq('journal_id', journalId)
        .eq('category_id', categoryId);

      return { error };
    } catch (error) {
      console.error("Error removing category from journal:", error);
      return { error };
    }
  },

  async getJournalCategories(journalId: string): Promise<{ data: Category[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('journal_categories')
        .select(`
          category_id,
          categories (
            id,
            name,
            color,
            user_id,
            created_at,
            updated_at
          )
        `)
        .eq('journal_id', journalId);

      if (error) return { data: null, error };

      const categories = data?.map(item => item.categories).filter(Boolean) as Category[];
      return { data: categories || [], error: null };
    } catch (error) {
      console.error("Error fetching journal categories:", error);
      return { data: null, error };
    }
  }
};
