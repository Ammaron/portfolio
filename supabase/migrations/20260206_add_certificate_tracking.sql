-- Add certificate tracking to placement test sessions
ALTER TABLE placement_test_sessions
  ADD COLUMN IF NOT EXISTS certificate_issued_at TIMESTAMPTZ;

-- Link certifications to placement test sessions
ALTER TABLE certifications
  ADD COLUMN IF NOT EXISTS placement_session_id UUID REFERENCES placement_test_sessions(id);
