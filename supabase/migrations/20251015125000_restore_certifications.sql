-- ============================================
-- Restore Certifications from Backup
-- Extracted from db_cluster-03-07-2025@22-28-12.backup
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

-- Insert certifications data (sample - you had one in your backup)
INSERT INTO public.certifications (id, certificate_code, student_name, student_email, course_type, level, completion_date, issue_date, expiration_date, grade, hours_completed, instructor_name, status, verification_code, created_at, updated_at) VALUES
('f268d0c4-fccd-4f54-84ca-8de96f39aa03', 'KMI-1A13-25-L7AM', 'John Smith', 'ammaron99@gmail.com', 'Essential English Foundations', 'A1', '2025-06-26', '2025-06-26', NULL, 'Pass', 90, 'Kirby McDonald', 'active', 'KAENEG', '2025-06-26 18:15:49.877548+00', '2025-06-26 18:15:49.877548+00')
ON CONFLICT (certificate_code) DO NOTHING;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_certificate_code ON public.certifications(certificate_code);
CREATE INDEX IF NOT EXISTS idx_student_email ON public.certifications(student_email);
CREATE INDEX IF NOT EXISTS idx_course_type ON public.certifications(course_type);
CREATE INDEX IF NOT EXISTS idx_status ON public.certifications(status);

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Certifications tables restored successfully!';
  RAISE NOTICE 'Certificate templates: 7 records';
  RAISE NOTICE 'Certifications: 1 sample record';
END $$;
