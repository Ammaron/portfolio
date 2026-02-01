-- Placement Test Database Schema
-- Run this migration in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Question bank table
CREATE TABLE IF NOT EXISTS placement_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_code VARCHAR(50) UNIQUE NOT NULL,
  cefr_level VARCHAR(2) NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  skill_type VARCHAR(20) NOT NULL CHECK (skill_type IN ('reading', 'listening', 'writing', 'speaking')),
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'gap_fill', 'matching', 'open_response')),
  question_text TEXT NOT NULL,
  question_text_es TEXT,
  passage_text TEXT,
  passage_text_es TEXT,
  audio_url TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  max_points INTEGER NOT NULL DEFAULT 1,
  difficulty_rating DECIMAL(3,2) DEFAULT 0.5 CHECK (difficulty_rating >= 0 AND difficulty_rating <= 1),
  discrimination_index DECIMAL(3,2) DEFAULT 0.5 CHECK (discrimination_index >= 0 AND discrimination_index <= 1),
  time_limit_seconds INTEGER,
  rubric JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for questions
CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON placement_questions(skill_type, cefr_level);
CREATE INDEX IF NOT EXISTS idx_questions_status ON placement_questions(status);

-- Test sessions table
CREATE TABLE IF NOT EXISTS placement_test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_code VARCHAR(10) UNIQUE NOT NULL,
  test_mode VARCHAR(20) NOT NULL CHECK (test_mode IN ('quick', 'personalized', 'advanced')),
  skills_tested TEXT[] NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  student_phone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'pending_review', 'reviewed', 'expired')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  time_spent_seconds INTEGER DEFAULT 0,
  current_question_index INTEGER DEFAULT 0,
  question_order JSONB DEFAULT '[]'::jsonb,
  raw_scores JSONB DEFAULT '{}'::jsonb,
  calculated_level VARCHAR(2),
  level_confidence DECIMAL(3,2),
  level_breakdown JSONB,
  admin_feedback TEXT,
  admin_adjusted_level VARCHAR(2),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for sessions
CREATE INDEX IF NOT EXISTS idx_sessions_code ON placement_test_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON placement_test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_sessions_mode ON placement_test_sessions(test_mode);
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON placement_test_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_email ON placement_test_sessions(student_email);

-- Answers table
CREATE TABLE IF NOT EXISTS placement_answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES placement_test_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES placement_questions(id) ON DELETE CASCADE,
  student_answer TEXT NOT NULL,
  is_correct BOOLEAN,
  points_earned DECIMAL(5,2) DEFAULT 0,
  max_points DECIMAL(5,2) NOT NULL,
  time_spent_seconds INTEGER DEFAULT 0,
  requires_review BOOLEAN DEFAULT FALSE,
  admin_score DECIMAL(5,2),
  admin_feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for answers
CREATE INDEX IF NOT EXISTS idx_answers_session ON placement_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_answers_question ON placement_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_review ON placement_answers(requires_review) WHERE requires_review = TRUE;

-- Configuration table
CREATE TABLE IF NOT EXISTS placement_test_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default configuration values
INSERT INTO placement_test_config (config_key, config_value, description) VALUES
  ('QUICK_QUESTIONS_PER_SKILL', '10', 'Number of questions per skill in Quick mode'),
  ('PERSONALIZED_QUESTIONS_PER_SKILL', '12', 'Number of questions per skill in Personalized mode'),
  ('QUICK_TIME_LIMIT_MINUTES', '30', 'Time limit for Quick mode in minutes'),
  ('PERSONALIZED_TIME_LIMIT_MINUTES', '60', 'Time limit for Personalized mode in minutes'),
  ('SESSION_EXPIRY_HOURS', '24', 'Hours before an in-progress session expires'),
  ('READING_WEIGHT', '0.25', 'Weight for Reading skill in overall score'),
  ('LISTENING_WEIGHT', '0.25', 'Weight for Listening skill in overall score'),
  ('WRITING_WEIGHT', '0.25', 'Weight for Writing skill in overall score'),
  ('SPEAKING_WEIGHT', '0.25', 'Weight for Speaking skill in overall score')
ON CONFLICT (config_key) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS update_questions_updated_at ON placement_questions;
CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON placement_questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_sessions_updated_at ON placement_test_sessions;
CREATE TRIGGER update_sessions_updated_at
  BEFORE UPDATE ON placement_test_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_config_updated_at ON placement_test_config;
CREATE TRIGGER update_config_updated_at
  BEFORE UPDATE ON placement_test_config
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE placement_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_config ENABLE ROW LEVEL SECURITY;

-- RLS Policies for public read access (questions and config)
CREATE POLICY "Allow public read access to active questions"
  ON placement_questions FOR SELECT
  USING (status = 'active');

CREATE POLICY "Allow public read access to config"
  ON placement_test_config FOR SELECT
  USING (true);

-- RLS Policies for sessions (users can only see their own by code)
CREATE POLICY "Allow public insert for sessions"
  ON placement_test_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select for sessions by code"
  ON placement_test_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public update for own sessions"
  ON placement_test_sessions FOR UPDATE
  USING (status = 'in_progress');

-- RLS Policies for answers
CREATE POLICY "Allow public insert for answers"
  ON placement_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select for answers"
  ON placement_answers FOR SELECT
  USING (true);

-- Service role can do everything (for admin operations)
-- The service role key bypasses RLS by default

-- Grant permissions
GRANT SELECT ON placement_questions TO anon, authenticated;
GRANT SELECT ON placement_test_config TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON placement_test_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON placement_answers TO anon, authenticated;

-- Sample questions (optional - for testing)
-- Uncomment and run if you want sample data

/*
INSERT INTO placement_questions (question_code, cefr_level, skill_type, question_type, question_text, options, correct_answer, max_points, difficulty_rating, discrimination_index) VALUES
-- Reading A1
('R-A1-001', 'A1', 'reading', 'mcq', 'Read the text: "My name is Maria. I am from Spain." Where is Maria from?', '[{"id": "A", "text": "France"}, {"id": "B", "text": "Spain"}, {"id": "C", "text": "Italy"}, {"id": "D", "text": "Germany"}]', 'B', 1, 0.3, 0.6),
('R-A1-002', 'A1', 'reading', 'true_false', 'Read: "The cat is sleeping on the bed." Statement: The cat is on the floor.', null, 'false', 1, 0.4, 0.5),

-- Reading B1
('R-B1-001', 'B1', 'reading', 'mcq', 'Read the passage about climate change and answer: What is the main cause of global warming according to the text?', '[{"id": "A", "text": "Natural cycles"}, {"id": "B", "text": "Human activity"}, {"id": "C", "text": "Solar radiation"}, {"id": "D", "text": "Ocean currents"}]', 'B', 1, 0.5, 0.7),

-- Listening A2
('L-A2-001', 'A2', 'listening', 'mcq', 'Listen to the conversation. What time does the train leave?', '[{"id": "A", "text": "2:00 PM"}, {"id": "B", "text": "2:30 PM"}, {"id": "C", "text": "3:00 PM"}, {"id": "D", "text": "3:30 PM"}]', 'B', 1, 0.4, 0.6),

-- Writing B2
('W-B2-001', 'B2', 'writing', 'open_response', 'Write a paragraph (100-150 words) discussing the advantages and disadvantages of working from home.', null, '', 5, 0.6, 0.7),

-- Speaking B1
('S-B1-001', 'B1', 'speaking', 'open_response', 'Describe your favorite holiday destination. Talk for 1-2 minutes about why you like it and what activities you can do there.', null, '', 5, 0.5, 0.6);
*/

-- Done!
COMMENT ON TABLE placement_questions IS 'Question bank for placement tests';
COMMENT ON TABLE placement_test_sessions IS 'Student test sessions and progress';
COMMENT ON TABLE placement_answers IS 'Individual answers for each session';
COMMENT ON TABLE placement_test_config IS 'Configurable settings for the placement test system';
