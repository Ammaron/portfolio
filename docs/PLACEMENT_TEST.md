# English Placement Test Feature

A comprehensive adaptive English placement test system with two modes (Quick and Personalized), integrated into the portfolio site.

## Overview

| Mode | Skills | Duration | Review | Results |
|------|--------|----------|--------|---------|
| **Quick** | Reading + Listening | ~25 min | Automated | Instant |
| **Personalized** | All 4 skills | ~45-60 min | Expert review | 24-48 hrs |

## Features

- **Adaptive Algorithm**: Questions adjust difficulty based on student performance
- **CEFR Levels**: A1-C2 assessment with per-skill breakdown
- **Audio Recording**: Speaking responses via MediaRecorder API
- **Pause/Resume**: Personalized mode allows session recovery via code
- **Admin Dashboard**: Review submissions, grade writing/speaking, manage questions
- **Email Notifications**: Automated emails for results and review completion
- **i18n Support**: Full English/Spanish translations

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── placement-test/
│   │   │   ├── page.tsx                    # Landing/mode selector
│   │   │   ├── quick/
│   │   │   │   ├── page.tsx                # Quick intro
│   │   │   │   ├── test/page.tsx           # Test interface
│   │   │   │   └── results/[sessionId]/    # Results
│   │   │   ├── personalized/
│   │   │   │   ├── page.tsx                # Registration
│   │   │   │   ├── test/page.tsx           # Test + pause
│   │   │   │   └── results/[sessionId]/    # Results
│   │   │   └── verify/page.tsx             # Session lookup
│   │   └── admin/placement-test/
│   │       ├── page.tsx                    # Dashboard
│   │       ├── submissions/                # All submissions
│   │       ├── submissions/[sessionId]/    # Grading
│   │       └── questions/                  # Question bank
│   └── api/placement-test/
│       ├── start/route.ts
│       ├── resume/route.ts
│       ├── session/[id]/question/route.ts
│       ├── session/[id]/answer/route.ts
│       ├── session/[id]/complete/route.ts
│       ├── results/[id]/route.ts
│       └── admin/...
├── components/placement-test/
│   └── QuestionRenderer.tsx
├── lib/
│   ├── placement-test.ts                   # Core logic
│   └── placement-test-email.ts             # Email functions
└── i18n/translations/
    └── placement-test.ts                   # EN/ES translations
```

## Database Schema

**Tables:**
- `placement_questions` - Question bank with CEFR levels
- `placement_test_sessions` - Test attempts and progress
- `placement_answers` - Individual student responses
- `placement_test_config` - Configurable settings

## Setup

### Prerequisites

The placement test uses the same EmailJS configuration as the contact form. Ensure these environment variables are set:

```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

### 1. Run Database Migration

Execute the SQL migration in your Supabase SQL Editor:

**File:** `supabase/migrations/20260201_create_placement_test_tables.sql`

```sql
-- Placement Test Database Schema

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
  difficulty_rating DECIMAL(3,2) DEFAULT 0.5,
  discrimination_index DECIMAL(3,2) DEFAULT 0.5,
  time_limit_seconds INTEGER,
  rubric JSONB,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test sessions table
CREATE TABLE IF NOT EXISTS placement_test_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_code VARCHAR(10) UNIQUE NOT NULL,
  test_mode VARCHAR(20) NOT NULL,
  skills_tested TEXT[] NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  student_email VARCHAR(255),
  student_phone VARCHAR(50),
  status VARCHAR(20) NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  time_spent_seconds INTEGER DEFAULT 0,
  current_question_index INTEGER DEFAULT 0,
  question_order JSONB DEFAULT '[]',
  raw_scores JSONB DEFAULT '{}',
  calculated_level VARCHAR(2),
  level_confidence DECIMAL(3,2),
  level_breakdown JSONB,
  admin_feedback TEXT,
  admin_adjusted_level VARCHAR(2),
  reviewed_by VARCHAR(255),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Config table
CREATE TABLE IF NOT EXISTS placement_test_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  config_key VARCHAR(100) UNIQUE NOT NULL,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_questions_skill_level ON placement_questions(skill_type, cefr_level);
CREATE INDEX IF NOT EXISTS idx_sessions_code ON placement_test_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON placement_test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_answers_session ON placement_answers(session_id);

-- Default config
INSERT INTO placement_test_config (config_key, config_value, description) VALUES
  ('QUICK_QUESTIONS_PER_SKILL', '10', 'Questions per skill in Quick mode'),
  ('PERSONALIZED_QUESTIONS_PER_SKILL', '12', 'Questions per skill in Personalized mode'),
  ('SESSION_EXPIRY_HOURS', '24', 'Hours before session expires')
ON CONFLICT (config_key) DO NOTHING;

-- Enable RLS
ALTER TABLE placement_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE placement_test_config ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "public_read_questions" ON placement_questions FOR SELECT USING (status = 'active');
CREATE POLICY "public_read_config" ON placement_test_config FOR SELECT USING (true);
CREATE POLICY "public_sessions" ON placement_test_sessions FOR ALL USING (true);
CREATE POLICY "public_answers" ON placement_answers FOR ALL USING (true);
```

### 2. Import Questions

Use the admin interface at `/admin/placement-test/questions` to:
- Add questions manually
- Import from Excel/JSON

### 3. Configure Settings

Default settings in `placement_test_config`:
- Questions per skill: 10 (quick), 12 (personalized)
- Time limits: 30 min (quick), 60 min (personalized)
- Skill weights: 25% each

## API Endpoints

### Public
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/placement-test/start` | Begin new session |
| POST | `/api/placement-test/resume` | Resume by code |
| GET | `/api/placement-test/session/[id]/question` | Get question |
| POST | `/api/placement-test/session/[id]/answer` | Submit answer |
| POST | `/api/placement-test/session/[id]/complete` | Finish test |
| GET | `/api/placement-test/results/[id]` | Get results |

### Admin (JWT required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/placement-test/admin` | Dashboard data |
| GET/POST/PUT/DELETE | `/api/placement-test/admin/questions` | Question CRUD |
| POST | `/api/placement-test/admin/questions/import` | Bulk import |
| GET/PUT | `/api/placement-test/admin/submissions/[id]/grade` | Grade submission |

## Adaptive Algorithm

The algorithm runs per-skill:

1. Start at B1 level (ability = 0.5)
2. Correct answer → increase ability estimate
3. Wrong answer → decrease ability estimate
4. Adjustment decreases as test progresses (convergence)
5. Final level = map ability (0-1) to CEFR (A1-C2)

## Question Types

- **MCQ**: Multiple choice (A/B/C/D)
- **True/False**: Binary choice
- **Gap Fill**: Fill in blanks
- **Matching**: Match items
- **Open Response**: Writing (text) or Speaking (audio)

## Email Notifications

The system sends emails via EmailJS (same config as contact form):

| Event | Recipient | Content |
|-------|-----------|---------|
| Quick test complete | Student (on request) | Results + level + skill breakdown |
| Personalized submitted | Student | Confirmation + session code |
| Review complete | Student | Results + expert feedback + certificate link |

Email functions are in `/src/lib/placement-test-email.ts`.

## Level Colors

| Level | Color | Description |
|-------|-------|-------------|
| A1 | Emerald | Beginner |
| A2 | Teal | Elementary |
| B1 | Blue | Intermediate |
| B2 | Indigo | Upper Intermediate |
| C1 | Purple | Advanced |
| C2 | Amber | Proficient |

## URLs

| Page | URL |
|------|-----|
| Landing | `/placement-test` |
| Quick Intro | `/placement-test/quick` |
| Quick Test | `/placement-test/quick/test?session={id}` |
| Quick Results | `/placement-test/quick/results/{sessionCode}` |
| Personalized Intro | `/placement-test/personalized` |
| Personalized Test | `/placement-test/personalized/test?session={id}` |
| Personalized Results | `/placement-test/personalized/results/{sessionCode}` |
| Verify/Resume | `/placement-test/verify` |
| Admin Dashboard | `/admin/placement-test` |
| Admin Submissions | `/admin/placement-test/submissions` |
| Admin Grading | `/admin/placement-test/submissions/{id}` |
| Admin Questions | `/admin/placement-test/questions` |
