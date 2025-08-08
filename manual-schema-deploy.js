const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function manualSchemaDeploy() {
  console.log('🔧 Manual Schema Deployment to Supabase');
  console.log('=========================================');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  console.log('📋 URGENT: Manual Schema Deployment Required');
  console.log('============================================');
  console.log('');
  console.log('The automated deployment failed. You MUST manually create the database tables.');
  console.log('');
  console.log('🚨 STEP-BY-STEP INSTRUCTIONS:');
  console.log('');
  console.log('1. Open your browser and go to: https://supabase.com/dashboard');
  console.log('2. Select your project (estgdcessxwbpdcgpxsa)');
  console.log('3. Click "SQL Editor" in the left sidebar');
  console.log('4. Click "New Query" button');
  console.log('5. Copy and paste the ENTIRE SQL block below:');
  console.log('');
  console.log('='.repeat(60));
  console.log('-- COPY THIS ENTIRE BLOCK --');
  console.log('='.repeat(60));
  console.log(`
-- Create questionnaire_responses table
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  answers JSONB NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create professional_signups table
CREATE TABLE IF NOT EXISTS professional_signups (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  firm TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  specialty TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  relationship_status TEXT,
  message TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anonymous users to insert (needed for form submissions)
CREATE POLICY "anon_insert_questionnaire_responses"
  ON questionnaire_responses
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_professional_signups"
  ON professional_signups
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_insert_contact_submissions"
  ON contact_submissions
  FOR INSERT TO anon WITH CHECK (true);
`);
  console.log('='.repeat(60));
  console.log('-- END OF SQL BLOCK --');
  console.log('='.repeat(60));
  console.log('');
  console.log('6. Click the "RUN" button (or press Ctrl+Enter)');
  console.log('7. Wait for "Success. No rows returned" message');
  console.log('8. Run this command to verify: node test-db-connection.js');
  console.log('');
  
  // Test current status
  console.log('🔍 Current Database Status:');
  console.log('---------------------------');
  const tables = ['questionnaire_responses', 'professional_signups', 'contact_submissions'];
  let allTablesExist = true;
    
  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });
        
      if (error) {
        console.log(`❌ ${table}: MISSING - ${error.message || 'Table does not exist'}`);
        allTablesExist = false;
      } else {
        console.log(`✅ ${table}: EXISTS`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ERROR - ${err.message || 'Cannot access table'}`);
      allTablesExist = false;
    }
  }
    
  if (allTablesExist) {
    console.log('');
    console.log('🎉 All tables already exist! Schema is deployed correctly.');
    console.log('   Run: node test-section2-implementation.js');
  } else {
    console.log('');
    console.log('🚨 TABLES ARE MISSING - Manual deployment is REQUIRED');
    console.log('   Follow the steps above to create the tables in Supabase dashboard');
  }
}

// Run the manual deployment guide
manualSchemaDeploy().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
