
-- Add columns to the journals table for OpenAI review data
ALTER TABLE journals 
ADD COLUMN french_accuracy_score INTEGER CHECK (french_accuracy_score >= 0 AND french_accuracy_score <= 100),
ADD COLUMN language_feedback TEXT,
ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE;

-- Create an index for better performance when querying by score
CREATE INDEX idx_journals_french_score ON journals(french_accuracy_score);
