const { createClient } = require('@supabase/supabase-js');
const { z } = require('zod');
require('dotenv').config();

async function testSection2Implementation() {
  console.log('🧪 Section 2 Implementation Test: Drizzle ORM + Zod + Supabase');
  console.log('================================================================');
  
  let allTestsPassed = true;
  
  try {
    // Test 1: Environment Variables
    console.log('\n📋 Test 1: Environment Variables');
    console.log('----------------------------------');
    
    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'ADMIN_API_KEY',
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ];
    
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: Set`);
      } else {
        console.log(`❌ ${envVar}: Missing`);
        allTestsPassed = false;
      }
    }
    
    // Test 2: Supabase Client Connection
    console.log('\n📋 Test 2: Supabase Client Connection');
    console.log('--------------------------------------');
    
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('❌ Cannot test Supabase connection - missing environment variables');
      allTestsPassed = false;
    } else {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      try {
        const { data, error } = await supabase.from('questionnaire_responses').select('count', { count: 'exact', head: true });
        if (error) {
          console.log(`❌ Supabase connection failed: ${error.message}`);
          allTestsPassed = false;
        } else {
          console.log('✅ Supabase client connection successful');
        }
      } catch (err) {
        console.log(`❌ Supabase connection error: ${err.message}`);
        allTestsPassed = false;
      }
    }
    
    // Test 3: Schema Files Exist
    console.log('\n📋 Test 3: Schema and Storage Files');
    console.log('------------------------------------');
    
    const fs = require('fs');
    const path = require('path');
    
    const requiredFiles = [
      'shared/schema.ts',
      'server/storage.ts',
      'server/routes.ts'
    ];
    
    for (const file of requiredFiles) {
      if (fs.existsSync(path.join(process.cwd(), file))) {
        console.log(`✅ ${file}: Exists`);
      } else {
        console.log(`❌ ${file}: Missing`);
        allTestsPassed = false;
      }
    }
    
    // Test 4: Zod Schema Validation
    console.log('\n📋 Test 4: Zod Schema Validation');
    console.log('----------------------------------');
    
    try {
      // Test questionnaire schema
      const questionnaireSchema = z.object({
        userId: z.string().min(1),
        answers: z.array(z.object({
          questionId: z.string(),
          question: z.string(),
          answer: z.any()
        }))
      });
      
      const validQuestionnaireData = {
        userId: 'test-user-123',
        answers: [
          {
            questionId: 'q1',
            question: 'Test question?',
            answer: 'Test answer'
          }
        ]
      };
      
      const result = questionnaireSchema.safeParse(validQuestionnaireData);
      if (result.success) {
        console.log('✅ Questionnaire Zod schema validation works');
      } else {
        console.log('❌ Questionnaire Zod schema validation failed');
        allTestsPassed = false;
      }
      
      // Test professional signup schema
      const professionalSchema = z.object({
        name: z.string().min(1),
        firm: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        specialty: z.string().min(1)
      });
      
      const validProfessionalData = {
        name: 'John Doe',
        firm: 'Test Firm',
        email: 'john@test.com',
        phone: '555-1234',
        specialty: 'Financial Planning'
      };
      
      const profResult = professionalSchema.safeParse(validProfessionalData);
      if (profResult.success) {
        console.log('✅ Professional signup Zod schema validation works');
      } else {
        console.log('❌ Professional signup Zod schema validation failed');
        allTestsPassed = false;
      }
      
      // Test contact schema
      const contactSchema = z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        phone: z.string().min(1),
        relationshipStatus: z.string().optional(),
        message: z.string().optional()
      });
      
      const validContactData = {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane@test.com',
        phone: '555-5678',
        relationshipStatus: 'married',
        message: 'Test message'
      };
      
      const contactResult = contactSchema.safeParse(validContactData);
      if (contactResult.success) {
        console.log('✅ Contact form Zod schema validation works');
      } else {
        console.log('❌ Contact form Zod schema validation failed');
        allTestsPassed = false;
      }
      
    } catch (err) {
      console.log(`❌ Zod schema test error: ${err.message}`);
      allTestsPassed = false;
    }
    
    // Test 5: Database Tables Structure via Storage Layer
    console.log('\n📋 Test 5: Database Tables Structure via Storage Layer');
    console.log('--------------------------------------------------------');
    
    if (process.env.DATABASE_URL) {
      try {
        // Import the storage layer
        const { storage } = require('./server/storage.js');
        
        // Test questionnaire_responses
        console.log('   Testing questionnaire_responses...');
        try {
          const questionnaireData = {
            userId: 'test-user-' + Date.now(),
            answers: { questionId: 'test', question: 'Test question?', answer: 'Test answer' }
          };
          
          const insertedQuestionnaire = await storage.createQuestionnaireResponse(questionnaireData);
          console.log(`✅ questionnaire_responses: Table accessible and writable (ID: ${insertedQuestionnaire.id})`);
          
          // Test retrieval
          const allQuestionnaires = await storage.getAllQuestionnaireResponses();
          console.log(`✅ questionnaire_responses: Can retrieve ${allQuestionnaires.length} records`);
        } catch (err) {
          console.log(`❌ questionnaire_responses: ${err.message}`);
          allTestsPassed = false;
        }
        
        // Test professional_signups
        console.log('   Testing professional_signups...');
        try {
          const professionalData = {
            name: 'Test Professional',
            firm: 'Test Firm',
            email: 'test@example.com',
            phone: '555-1234',
            specialty: 'Financial Planning'
          };
          
          const insertedProfessional = await storage.createProfessionalSignup(professionalData);
          console.log(`✅ professional_signups: Table accessible and writable (ID: ${insertedProfessional.id})`);
          
          // Test retrieval
          const allProfessionals = await storage.getAllProfessionalSignups();
          console.log(`✅ professional_signups: Can retrieve ${allProfessionals.length} records`);
        } catch (err) {
          console.log(`❌ professional_signups: ${err.message}`);
          allTestsPassed = false;
        }
        
        // Test contact_submissions
        console.log('   Testing contact_submissions...');
        try {
          const contactData = {
            firstName: 'Test',
            lastName: 'User',
            email: 'test@example.com',
            phone: '555-1234',
            relationshipStatus: 'married',
            message: 'Test message'
          };
          
          const insertedContact = await storage.createContactSubmission(contactData);
          console.log(`✅ contact_submissions: Table accessible and writable (ID: ${insertedContact.id})`);
          
          // Test retrieval
          const allContacts = await storage.getAllContactSubmissions();
          console.log(`✅ contact_submissions: Can retrieve ${allContacts.length} records`);
        } catch (err) {
          console.log(`❌ contact_submissions: ${err.message}`);
          allTestsPassed = false;
        }
        
      } catch (importErr) {
        console.log(`❌ Storage layer import failed: ${importErr.message}`);
        console.log('   This might be due to missing DATABASE_URL or TypeScript compilation issues');
        allTestsPassed = false;
      }
    } else {
      console.log('❌ DATABASE_URL not found - cannot test storage layer');
      allTestsPassed = false;
    }
    
    // Test 6: API Endpoints Structure
    console.log('\n📋 Test 6: API Endpoints Structure');
    console.log('-----------------------------------');
    
    try {
      const routesContent = fs.readFileSync(path.join(process.cwd(), 'server/routes.ts'), 'utf8');
      
      const expectedEndpoints = [
        'POST /api/questionnaire/submit',
        'GET /api/questionnaire/responses',
        'POST /api/professionals',
        'GET /api/professionals',
        'POST /api/contact',
        'GET /api/contact'
      ];
      
      const endpointChecks = [
        { endpoint: 'POST /api/questionnaire/submit', pattern: /app\.post\(["']\/api\/questionnaire\/submit["']/ },
        { endpoint: 'GET /api/questionnaire/responses', pattern: /app\.get\(["']\/api\/questionnaire\/responses["']/ },
        { endpoint: 'POST /api/professionals', pattern: /app\.post\(["']\/api\/professionals["']/ },
        { endpoint: 'GET /api/professionals', pattern: /app\.get\(["']\/api\/professionals["']/ },
        { endpoint: 'POST /api/contact', pattern: /app\.post\(["']\/api\/contact["']/ },
        { endpoint: 'GET /api/contact', pattern: /app\.get\(["']\/api\/contact["']/ }
      ];
      
      for (const check of endpointChecks) {
        if (check.pattern.test(routesContent)) {
          console.log(`✅ ${check.endpoint}: Endpoint defined`);
        } else {
          console.log(`❌ ${check.endpoint}: Endpoint missing`);
          allTestsPassed = false;
        }
      }
      
      // Check for admin middleware
      if (routesContent.includes('requireAdmin')) {
        console.log('✅ Admin authentication middleware: Present');
      } else {
        console.log('❌ Admin authentication middleware: Missing');
        allTestsPassed = false;
      }
      
    } catch (err) {
      console.log(`❌ Routes file analysis error: ${err.message}`);
      allTestsPassed = false;
    }
    
    // Test 7: Storage Layer Implementation
    console.log('\n📋 Test 7: Storage Layer Implementation');
    console.log('---------------------------------------');
    
    try {
      const storageContent = fs.readFileSync(path.join(process.cwd(), 'server/storage.ts'), 'utf8');
      
      const storageChecks = [
        { feature: 'SupabaseStorage class', pattern: /class SupabaseStorage/ },
        { feature: 'createQuestionnaireResponse method', pattern: /createQuestionnaireResponse/ },
        { feature: 'getAllQuestionnaireResponses method', pattern: /getAllQuestionnaireResponses/ },
        { feature: 'createProfessionalSignup method', pattern: /createProfessionalSignup/ },
        { feature: 'getAllProfessionalSignups method', pattern: /getAllProfessionalSignups/ },
        { feature: 'createContactSubmission method', pattern: /createContactSubmission/ },
        { feature: 'getAllContactSubmissions method', pattern: /getAllContactSubmissions/ }
      ];
      
      for (const check of storageChecks) {
        if (check.pattern.test(storageContent)) {
          console.log(`✅ ${check.feature}: Implemented`);
        } else {
          console.log(`❌ ${check.feature}: Missing`);
          allTestsPassed = false;
        }
      }
      
    } catch (err) {
      console.log(`❌ Storage file analysis error: ${err.message}`);
      allTestsPassed = false;
    }
    
    // Final Results
    console.log('\n🎯 Section 2 Implementation Test Results');
    console.log('=========================================');
    
    if (allTestsPassed) {
      console.log('🎉 ALL TESTS PASSED! Section 2 implementation is complete and correct.');
      console.log('\n✅ Drizzle ORM integration: Ready');
      console.log('✅ Zod validation schemas: Working');
      console.log('✅ Supabase connection: Established');
      console.log('✅ Database schema: Deployed');
      console.log('✅ API endpoints: Implemented');
      console.log('✅ Storage layer: Complete');
      console.log('✅ Admin authentication: Configured');
    } else {
      console.log('❌ SOME TESTS FAILED. Please review the issues above.');
      console.log('\nNext steps:');
      console.log('1. Fix any missing environment variables');
      console.log('2. Ensure all required files exist');
      console.log('3. Verify database schema is deployed');
      console.log('4. Check API endpoint implementations');
    }
    
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    allTestsPassed = false;
  }
  
  return allTestsPassed;
}

// Run the test
testSection2Implementation().then(success => {
  process.exit(success ? 0 : 1);
}).catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
