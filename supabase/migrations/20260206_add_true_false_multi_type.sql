-- Add 'true_false_multi' to the question_type CHECK constraint
-- Include all question types used in the application
ALTER TABLE placement_questions DROP CONSTRAINT IF EXISTS placement_questions_question_type_check;
ALTER TABLE placement_questions ADD CONSTRAINT placement_questions_question_type_check
  CHECK (question_type IN ('mcq', 'true_false', 'true_false_multi', 'gap_fill', 'matching', 'open_response', 'form_filling', 'short_message', 'picture_description', 'interview'));
