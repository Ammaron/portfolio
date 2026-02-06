-- ============================================
-- COMBINED MIGRATION FOR PORTFOLIO DATABASE
-- Run this in Supabase SQL Editor
-- Project: hmvksvxxhxflckdkqbfy
-- ============================================

-- ============================================
-- PART 1: CERTIFICATIONS
-- ============================================

-- Create certificate_templates table
CREATE TABLE IF NOT EXISTS public.certificate_templates (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    template_name character varying(255) NOT NULL,
    course_type character varying(100) NOT NULL,
    level character varying(10),
    description text,
    requirements text,
    validity_period_months integer,
    created_at timestamp with time zone DEFAULT now()
);

-- Create certifications table
CREATE TABLE IF NOT EXISTS public.certifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    certificate_code character varying(50) NOT NULL,
    student_name character varying(255) NOT NULL,
    student_email character varying(255),
    course_type character varying(100) NOT NULL,
    level character varying(10) NOT NULL,
    completion_date date NOT NULL,
    issue_date date DEFAULT CURRENT_DATE NOT NULL,
    expiration_date date,
    grade character varying(20),
    hours_completed integer,
    instructor_name character varying(255) DEFAULT 'Kirby McDonald'::character varying,
    status character varying(20) DEFAULT 'active'::character varying,
    verification_code character varying(6) NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Add primary keys
DO $$ BEGIN
    ALTER TABLE public.certificate_templates ADD CONSTRAINT certificate_templates_pkey PRIMARY KEY (id);
EXCEPTION
    WHEN duplicate_table THEN NULL;
    WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    ALTER TABLE public.certifications ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);
EXCEPTION
    WHEN duplicate_table THEN NULL;
    WHEN duplicate_object THEN NULL;
END $$;

-- Add unique constraint
DO $$ BEGIN
    ALTER TABLE public.certifications ADD CONSTRAINT certifications_certificate_code_key UNIQUE (certificate_code);
EXCEPTION
    WHEN duplicate_table THEN NULL;
    WHEN duplicate_object THEN NULL;
END $$;

-- Insert certificate templates data
INSERT INTO public.certificate_templates (id, template_name, course_type, level, description, requirements, validity_period_months, created_at) VALUES
('682be6de-6044-40a5-a3b5-0bc3c89e7970', 'CEFR A1 Certificate', 'Essential English Foundations', 'A1', 'Internationally recognized CEFR A1 level certification', 'Complete 90-100 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('b669966f-f555-4c6d-babd-4ecca300db50', 'CEFR A2 Certificate', 'Practical English Communication', 'A2', 'Internationally recognized CEFR A2 level certification', 'Complete 90-100 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('3ca19b85-a405-47f8-a354-1f748b06487b', 'CEFR B1 Certificate', 'Independent English Mastery', 'B1', 'Internationally recognized CEFR B1 level certification', 'Complete 150-200 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('e2a90262-179c-49a0-bf10-6155b7dc8feb', 'CEFR B2 Certificate', 'Advanced English Fluency', 'B2', 'Internationally recognized CEFR B2 level certification', 'Complete 150-200 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('2cf7070a-b975-43e2-96b8-f842bac36c03', 'CEFR C1 Certificate', 'Expert English Proficiency', 'C1', 'Internationally recognized CEFR C1 level certification', 'Complete 200-300 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('b46f7611-1a50-4aad-a5c7-eff4aa287d8b', 'CEFR C2 Certificate', 'Native-Level English Mastery', 'C2', 'Internationally recognized CEFR C2 level certification', 'Complete 300-500 guided hours and pass final assessment', NULL, '2025-06-25 01:08:26.823553+00'),
('a15091c2-3ed6-4308-9fdf-123a0aecc98c', 'Business Communication Certificate', 'Professional Business Communication', 'PROF', 'Professional business communication skills certification', 'Complete specialized business communication course', 24, '2025-06-25 01:08:26.823553+00')
ON CONFLICT (id) DO NOTHING;

-- Create indexes for certifications
CREATE INDEX IF NOT EXISTS idx_certificate_code ON public.certifications(certificate_code);
CREATE INDEX IF NOT EXISTS idx_student_email ON public.certifications(student_email);
CREATE INDEX IF NOT EXISTS idx_course_type ON public.certifications(course_type);
CREATE INDEX IF NOT EXISTS idx_cert_status ON public.certifications(status);

-- ============================================
-- PART 2: BLOG TABLES
-- ============================================

-- Blog posts table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    title_es VARCHAR(500),
    excerpt TEXT NOT NULL,
    excerpt_es TEXT,
    content TEXT NOT NULL,
    content_es TEXT,
    featured_image VARCHAR(500),
    author VARCHAR(255) DEFAULT 'Kirby McDonald',
    category VARCHAR(100),
    tags TEXT[],
    status VARCHAR(20) DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    reading_time_minutes INTEGER,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog categories table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    name_es VARCHAR(100),
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    description_es TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog comments table
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for blog
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_status ON public.blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_published_at ON public.blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_category ON public.blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_tags ON public.blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_comment_post ON public.blog_comments(post_id);

-- Sample blog categories
INSERT INTO public.blog_categories (name, name_es, slug, description, description_es) VALUES
('Teaching', 'Enseñanza', 'teaching', 'Tips and insights about teaching English', 'Consejos e ideas sobre la enseñanza del inglés'),
('Language Learning', 'Aprendizaje de Idiomas', 'language-learning', 'Strategies and resources for language learners', 'Estrategias y recursos para estudiantes de idiomas'),
('Technology', 'Tecnología', 'technology', 'Educational technology and digital tools', 'Tecnología educativa y herramientas digitales'),
('Culture', 'Cultura', 'culture', 'Cultural insights and cross-cultural communication', 'Perspectivas culturales y comunicación intercultural'),
('Professional Development', 'Desarrollo Profesional', 'professional-development', 'Career growth and professional skills', 'Crecimiento profesional y habilidades profesionales')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- PART 3: PLACEMENT TEST TABLES
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Question bank table
CREATE TABLE IF NOT EXISTS placement_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_code VARCHAR(50) UNIQUE NOT NULL,
  cefr_level VARCHAR(2) NOT NULL CHECK (cefr_level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  skill_type VARCHAR(20) NOT NULL CHECK (skill_type IN ('reading', 'listening', 'writing', 'speaking')),
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN ('mcq', 'true_false', 'true_false_multi', 'gap_fill', 'matching', 'open_response', 'form_filling', 'short_message', 'picture_description', 'interview')),
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

-- ============================================
-- PART 4: FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Triggers for placement tables
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

-- Function to increment view count
CREATE OR REPLACE FUNCTION public.increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.blog_posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 5: ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_config ENABLE ROW LEVEL SECURITY;

-- Blog policies
DROP POLICY IF EXISTS "Public can view published posts" ON public.blog_posts;
CREATE POLICY "Public can view published posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Authenticated users have full access" ON public.blog_posts;
CREATE POLICY "Authenticated users have full access"
  ON public.blog_posts
  FOR ALL
  USING (auth.role() = 'authenticated');

-- Placement test policies
CREATE POLICY IF NOT EXISTS "Allow public read access to active questions"
  ON placement_questions FOR SELECT
  USING (status = 'active');

CREATE POLICY IF NOT EXISTS "Allow public read access to config"
  ON placement_test_config FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public insert for sessions"
  ON placement_test_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public select for sessions by code"
  ON placement_test_sessions FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow public update for own sessions"
  ON placement_test_sessions FOR UPDATE
  USING (status = 'in_progress');

CREATE POLICY IF NOT EXISTS "Allow public insert for answers"
  ON placement_answers FOR INSERT
  WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow public select for answers"
  ON placement_answers FOR SELECT
  USING (true);

-- ============================================
-- PART 6: PERMISSIONS
-- ============================================

GRANT SELECT ON placement_questions TO anon, authenticated;
GRANT SELECT ON placement_test_config TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON placement_test_sessions TO anon, authenticated;
GRANT SELECT, INSERT ON placement_answers TO anon, authenticated;

-- ============================================
-- DONE!
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '=============================================';
  RAISE NOTICE 'Migration completed successfully!';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - certificate_templates';
  RAISE NOTICE '  - certifications';
  RAISE NOTICE '  - blog_posts';
  RAISE NOTICE '  - blog_categories';
  RAISE NOTICE '  - blog_comments';
  RAISE NOTICE '  - placement_questions';
  RAISE NOTICE '  - placement_test_sessions';
  RAISE NOTICE '  - placement_answers';
  RAISE NOTICE '  - placement_test_config';
  RAISE NOTICE '=============================================';
END $$;
