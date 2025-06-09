
-- Add draft-related columns to the journals table (only if they don't exist)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journals' AND column_name = 'is_draft') THEN
    ALTER TABLE public.journals ADD COLUMN is_draft BOOLEAN DEFAULT true;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journals' AND column_name = 'auto_saved_at') THEN
    ALTER TABLE public.journals ADD COLUMN auto_saved_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'journals' AND column_name = 'last_local_edit') THEN
    ALTER TABLE public.journals ADD COLUMN last_local_edit TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_journals_is_draft ON public.journals(user_id, is_draft);
CREATE INDEX IF NOT EXISTS idx_journals_auto_saved ON public.journals(user_id, auto_saved_at) WHERE is_draft = true;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own journals and drafts" ON public.journals;
DROP POLICY IF EXISTS "Users can create their own journals" ON public.journals;
DROP POLICY IF EXISTS "Users can update their own journals" ON public.journals;
DROP POLICY IF EXISTS "Users can delete their own journals" ON public.journals;

-- Create new policies for draft functionality
CREATE POLICY "Users can view their own journals and drafts" 
  ON public.journals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journals" 
  ON public.journals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journals" 
  ON public.journals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journals" 
  ON public.journals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create function to auto-save drafts
CREATE OR REPLACE FUNCTION public.auto_save_draft(
  p_entry_id UUID DEFAULT NULL,
  p_content TEXT DEFAULT '',
  p_user_id UUID DEFAULT auth.uid()
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  entry_id UUID;
BEGIN
  -- If entry_id is provided, update existing draft
  IF p_entry_id IS NOT NULL THEN
    UPDATE public.journals
    SET 
      content = p_content,
      auto_saved_at = now(),
      last_local_edit = now(),
      updated_at = now()
    WHERE id = p_entry_id 
      AND user_id = p_user_id 
      AND is_draft = true;
    
    entry_id := p_entry_id;
  ELSE
    -- Create new draft
    INSERT INTO public.journals (user_id, content, is_draft, auto_saved_at, last_local_edit)
    VALUES (p_user_id, p_content, true, now(), now())
    RETURNING id INTO entry_id;
  END IF;
  
  RETURN entry_id;
END;
$$;

-- Create function to publish draft
CREATE OR REPLACE FUNCTION public.publish_draft(p_entry_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.journals
  SET 
    is_draft = false,
    updated_at = now()
  WHERE id = p_entry_id 
    AND user_id = auth.uid()
    AND is_draft = true;
  
  RETURN FOUND;
END;
$$;
