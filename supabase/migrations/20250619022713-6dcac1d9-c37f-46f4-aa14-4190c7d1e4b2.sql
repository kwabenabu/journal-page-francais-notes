
-- Create a table for vocabulary words
CREATE TABLE public.vocabulary_words (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  french_word TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  part_of_speech TEXT,
  example_sentence TEXT,
  journal_entry_id UUID REFERENCES public.journals(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own vocabulary
ALTER TABLE public.vocabulary_words ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own vocabulary words
CREATE POLICY "Users can view their own vocabulary words" 
  ON public.vocabulary_words 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own vocabulary words
CREATE POLICY "Users can create their own vocabulary words" 
  ON public.vocabulary_words 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to UPDATE their own vocabulary words
CREATE POLICY "Users can update their own vocabulary words" 
  ON public.vocabulary_words 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own vocabulary words
CREATE POLICY "Users can delete their own vocabulary words" 
  ON public.vocabulary_words 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance when querying by user_id
CREATE INDEX idx_vocabulary_words_user_id ON public.vocabulary_words(user_id);
