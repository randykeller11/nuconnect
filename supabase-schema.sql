-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS public.questionnaire_responses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  answers JSONB NOT NULL,
  is_complete BOOLEAN DEFAULT FALSE NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create professional_signups table
CREATE TABLE IF NOT EXISTS public.professional_signups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship_status TEXT,
  message TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add foreign key constraint
ALTER TABLE public.questionnaire_responses 
ADD CONSTRAINT IF NOT EXISTS fk_questionnaire_user 
FOREIGN KEY (user_id) REFERENCES public.users(id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Drop legacy / conflicting policies if they exist
DROP POLICY IF EXISTS "anon_insert_questionnaire_responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "anon_insert_professional_signups" ON public.professional_signups;
DROP POLICY IF EXISTS "anon_insert_contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "anon_insert_users" ON public.users;

DROP POLICY IF EXISTS "Enable all access for service role on questionnaire_responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "Enable all access for service role on professional_signups" ON public.professional_signups;
DROP POLICY IF EXISTS "Enable all access for service role on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable all access for service role on users" ON public.users;

DROP POLICY IF EXISTS "service_role_all_questionnaire_responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "service_role_all_professional_signups" ON public.professional_signups;
DROP POLICY IF EXISTS "service_role_all_contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "service_role_all_users" ON public.users;

DROP POLICY IF EXISTS "Enable insert for anonymous users on questionnaire_responses" ON public.questionnaire_responses;
DROP POLICY IF EXISTS "Enable insert for anonymous users on professional_signups" ON public.professional_signups;
DROP POLICY IF EXISTS "Enable insert for anonymous users on contact_submissions" ON public.contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anonymous users on users" ON public.users;

-- Create policies to allow service role full access (for admin operations)
CREATE POLICY "service_role_all_users" ON public.users
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_questionnaire_responses" ON public.questionnaire_responses
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_professional_signups" ON public.professional_signups
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_role_all_contact_submissions" ON public.contact_submissions
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create policies to allow anonymous users to insert (needed for form submissions)
CREATE POLICY "anon_insert_users" ON public.users
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_questionnaire_responses"
  ON public.questionnaire_responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_professional_signups"
  ON public.professional_signups
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_contact_submissions"
  ON public.contact_submissions
  FOR INSERT TO anon WITH CHECK (true);
