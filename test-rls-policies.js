const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testRLSPolicies() {
  console.log('🔐 Testing RLS Policies and Database Operations');
  console.log('===============================================');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    console.log('\n📊 Testing questionnaire_responses table...');
    
    // Test 1: Try to insert data
    const testQuestionnaireData = {
      user_id: 'test-user-' + Date.now(),
      answers: { questionId: 'test', question: 'Test question?', answer: 'Test answer' }
    };
    
    console.log('Attempting to insert:', JSON.stringify(testQuestionnaireData, null, 2));
    
    const { data: insertData, error: insertError } = await supabase
      .from('questionnaire_responses')
      .insert(testQuestionnaireData)
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Insert failed:', insertError.message || 'Unknown error');
      console.log('Error code:', insertError.code || 'No code');
      console.log('Error details:', insertError.details || 'No details');
      console.log('Error hint:', insertError.hint || 'No hint');
      console.log('Full error:', JSON.stringify(insertError, null, 2));
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('questionnaire_responses')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        console.log('⚠️  Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }
    
    console.log('\n📊 Testing professional_signups table...');
    
    const testProfessionalData = {
      name: 'Test Professional',
      firm: 'Test Firm',
      email: 'test@example.com',
      phone: '555-1234',
      specialty: 'Financial Planning'
    };
    
    console.log('Attempting to insert:', JSON.stringify(testProfessionalData, null, 2));
    
    const { data: profData, error: profError } = await supabase
      .from('professional_signups')
      .insert(testProfessionalData)
      .select()
      .single();
    
    if (profError) {
      console.log('❌ Insert failed:', profError.message || 'Unknown error');
      console.log('Error code:', profError.code || 'No code');
      console.log('Error details:', profError.details || 'No details');
      console.log('Error hint:', profError.hint || 'No hint');
      console.log('Full error:', JSON.stringify(profError, null, 2));
    } else {
      console.log('✅ Insert successful:', profData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('professional_signups')
        .delete()
        .eq('id', profData.id);
      
      if (deleteError) {
        console.log('⚠️  Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }
    
    console.log('\n📊 Testing contact_submissions table...');
    
    const testContactData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '555-1234',
      relationship_status: 'married',
      message: 'Test message'
    };
    
    console.log('Attempting to insert:', JSON.stringify(testContactData, null, 2));
    
    const { data: contactData, error: contactError } = await supabase
      .from('contact_submissions')
      .insert(testContactData)
      .select()
      .single();
    
    if (contactError) {
      console.log('❌ Insert failed:', contactError.message || 'Unknown error');
      console.log('Error code:', contactError.code || 'No code');
      console.log('Error details:', contactError.details || 'No details');
      console.log('Error hint:', contactError.hint || 'No hint');
      console.log('Full error:', JSON.stringify(contactError, null, 2));
    } else {
      console.log('✅ Insert successful:', contactData);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('contact_submissions')
        .delete()
        .eq('id', contactData.id);
      
      if (deleteError) {
        console.log('⚠️  Delete failed:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }
    
    console.log('\n🔍 Testing table structure...');
    
    // Check table columns
    const tables = ['questionnaire_responses', 'professional_signups', 'contact_submissions'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table} structure check failed:`, error.message);
        } else {
          console.log(`✅ ${table} structure check passed`);
          if (data && data.length > 0) {
            console.log(`   Sample columns:`, Object.keys(data[0]));
          }
        }
      } catch (err) {
        console.log(`❌ ${table} structure check error:`, err.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  }
}

// Run the test
testRLSPolicies().catch(err => {
  console.error('Test runner error:', err);
  process.exit(1);
});
