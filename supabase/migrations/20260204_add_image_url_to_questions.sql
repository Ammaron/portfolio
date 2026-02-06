-- Add image_url column to placement_questions table
-- This column was missing from the original schema

ALTER TABLE placement_questions ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Update question_type constraint to include new types
ALTER TABLE placement_questions DROP CONSTRAINT IF EXISTS placement_questions_question_type_check;
ALTER TABLE placement_questions ADD CONSTRAINT placement_questions_question_type_check
  CHECK (question_type IN ('mcq', 'true_false', 'gap_fill', 'matching', 'open_response', 'form_filling', 'short_message', 'picture_description', 'interview'));

-- Add comment
COMMENT ON COLUMN placement_questions.image_url IS 'URL for question-related images';
