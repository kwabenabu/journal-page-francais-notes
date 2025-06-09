
-- Create user profiles table for customization settings (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  theme_preference TEXT DEFAULT 'auto' CHECK (theme_preference IN ('light', 'dark', 'auto')),
  language_preference TEXT DEFAULT 'en' CHECK (language_preference IN ('en', 'fr')),
  writing_goal INTEGER DEFAULT 300,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create writing statistics table for tracking progress (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.writing_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  word_count INTEGER DEFAULT 0,
  entries_written INTEGER DEFAULT 0,
  total_accuracy_score NUMERIC(5,2) DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Enable RLS on both tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.writing_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Drop and recreate profiles policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  
  CREATE POLICY "Users can view their own profile" 
    ON public.profiles 
    FOR SELECT 
    USING (auth.uid() = id);

  CREATE POLICY "Users can update their own profile" 
    ON public.profiles 
    FOR UPDATE 
    USING (auth.uid() = id);

  CREATE POLICY "Users can insert their own profile" 
    ON public.profiles 
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

  -- Drop and recreate writing_stats policies
  DROP POLICY IF EXISTS "Users can view their own stats" ON public.writing_stats;
  DROP POLICY IF EXISTS "Users can insert their own stats" ON public.writing_stats;
  DROP POLICY IF EXISTS "Users can update their own stats" ON public.writing_stats;
  
  CREATE POLICY "Users can view their own stats" 
    ON public.writing_stats 
    FOR SELECT 
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own stats" 
    ON public.writing_stats 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own stats" 
    ON public.writing_stats 
    FOR UPDATE 
    USING (auth.uid() = user_id);
END $$;
