
-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Create journal_categories junction table for many-to-many relationship
CREATE TABLE public.journal_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  journal_id UUID NOT NULL REFERENCES public.journals(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(journal_id, category_id)
);

-- Add search vector column to journals for full-text search
ALTER TABLE public.journals 
ADD COLUMN search_vector tsvector;

-- Create index for full-text search
CREATE INDEX journals_search_idx ON public.journals USING gin(search_vector);

-- Create function to update search vector
CREATE OR REPLACE FUNCTION update_journal_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := to_tsvector('french', COALESCE(NEW.content, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update search vector
CREATE TRIGGER update_journal_search_trigger
  BEFORE INSERT OR UPDATE ON public.journals
  FOR EACH ROW
  EXECUTE FUNCTION update_journal_search_vector();

-- Update existing journals with search vectors
UPDATE public.journals 
SET search_vector = to_tsvector('french', COALESCE(content, ''))
WHERE search_vector IS NULL;

-- Enable RLS on categories table
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for categories
CREATE POLICY "Users can view their own categories" 
  ON public.categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own categories" 
  ON public.categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own categories" 
  ON public.categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own categories" 
  ON public.categories 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Enable RLS on journal_categories table
ALTER TABLE public.journal_categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journal_categories
CREATE POLICY "Users can view their own journal categories" 
  ON public.journal_categories 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.journals j 
      WHERE j.id = journal_id AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own journal categories" 
  ON public.journal_categories 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.journals j 
      WHERE j.id = journal_id AND j.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete their own journal categories" 
  ON public.journal_categories 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.journals j 
      WHERE j.id = journal_id AND j.user_id = auth.uid()
    )
  );
