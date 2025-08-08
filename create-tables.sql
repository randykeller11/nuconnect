-- Modern Matrimoney Database Schema
-- Copy and paste this entire script into Supabase SQL Editor

-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create questionnaire_responses table
CREATE TABLE questionnaire_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  answers JSONB NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create professional_signups table
CREATE TABLE professional_signups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contact_submissions table
CREATE TABLE contact_submissions (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship_status TEXT,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Add foreign key constraint
ALTER TABLE questionnaire_responses 
ADD CONSTRAINT IF NOT EXISTS fk_questionnaire_user 
FOREIGN KEY (user_id) REFERENCES users(id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role full access (for admin operations)
CREATE POLICY "service_role_all_users" ON users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_questionnaire_responses" ON questionnaire_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_professional_signups" ON professional_signups
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_contact_submissions" ON contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create policies to allow anonymous users to insert data (for form submissions)
CREATE POLICY "anon_insert_users" ON users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_questionnaire_responses" ON questionnaire_responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_professional_signups" ON professional_signups
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_contact_submissions" ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);

-- Verify tables were created
SELECT 'questionnaire_responses' as table_name, COUNT(*) as record_count FROM questionnaire_responses
UNION ALL
SELECT 'professional_signups' as table_name, COUNT(*) as record_count FROM professional_signups
UNION ALL
SELECT 'contact_submissions' as table_name, COUNT(*) as record_count FROM contact_submissions;
