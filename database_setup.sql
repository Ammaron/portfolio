-- Certifications Database Schema
-- Run this in your Supabase SQL editor

-- Certifications table
CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code VARCHAR(50) UNIQUE NOT NULL, -- e.g., "KMI-4A7B-25-X9K2" (increased from 12 to 50)
    student_name VARCHAR(255) NOT NULL,
    student_email VARCHAR(255),
    course_type VARCHAR(100) NOT NULL, -- "Essential English Foundations", "Business Communication", etc.
    level VARCHAR(10) NOT NULL, -- "A1", "A2", "B1", "B2", "C1", "C2"
    completion_date DATE NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expiration_date DATE, -- Some certifications might expire
    grade VARCHAR(20), -- "Pass", "Merit", "Distinction", or percentage
    hours_completed INTEGER,
    instructor_name VARCHAR(255) DEFAULT 'Kirby McDonald',
    status VARCHAR(20) DEFAULT 'active', -- active, expired, revoked
    verification_code VARCHAR(6) NOT NULL, -- Additional security code
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certificate templates table (for different types of certificates)
CREATE TABLE certificate_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_name VARCHAR(255) NOT NULL,
    course_type VARCHAR(100) NOT NULL,
    level VARCHAR(10),
    description TEXT,
    requirements TEXT,
    validity_period_months INTEGER, -- NULL if no expiration
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_certificate_code ON certifications(certificate_code);
CREATE INDEX idx_student_email ON certifications(student_email);
CREATE INDEX idx_course_type ON certifications(course_type);
CREATE INDEX idx_status ON certifications(status);

-- Sample certificate templates
INSERT INTO certificate_templates (template_name, course_type, level, description, requirements, validity_period_months) VALUES
('CEFR A1 Certificate', 'Essential English Foundations', 'A1', 'Internationally recognized CEFR A1 level certification', 'Complete 90-100 guided hours and pass final assessment', NULL),
('CEFR A2 Certificate', 'Practical English Communication', 'A2', 'Internationally recognized CEFR A2 level certification', 'Complete 90-100 guided hours and pass final assessment', NULL),
('CEFR B1 Certificate', 'Independent English Mastery', 'B1', 'Internationally recognized CEFR B1 level certification', 'Complete 150-200 guided hours and pass final assessment', NULL),
('CEFR B2 Certificate', 'Advanced English Fluency', 'B2', 'Internationally recognized CEFR B2 level certification', 'Complete 150-200 guided hours and pass final assessment', NULL),
('CEFR C1 Certificate', 'Expert English Proficiency', 'C1', 'Internationally recognized CEFR C1 level certification', 'Complete 200-300 guided hours and pass final assessment', NULL),
('CEFR C2 Certificate', 'Native-Level English Mastery', 'C2', 'Internationally recognized CEFR C2 level certification', 'Complete 300-500 guided hours and pass final assessment', NULL),
('Business Communication Certificate', 'Professional Business Communication', 'PROF', 'Professional business communication skills certification', 'Complete specialized business communication course', 24);