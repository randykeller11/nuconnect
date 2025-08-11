#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Phase 2: Database Migrations...\n');

// Check if Supabase environment variables are set
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

console.log('📋 Checking environment variables...');
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.log('⚠️  Missing environment variables:');
  missingEnvVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
  });
  console.log('\n💡 Please set these in your .env.local file');
} else {
  console.log('✅ All required environment variables are set');
}

// Check if migration file exists
console.log('\n📁 Checking migration files...');
const migrationFile = 'supabase/migrations/20250111_nuconnect_core.sql';
if (fs.existsSync(migrationFile)) {
  console.log('✅ Migration file exists');
  
  // Check migration file content
  const migrationContent = fs.readFileSync(migrationFile, 'utf8');
  const expectedTables = [
    'profiles',
    'events', 
    'match_rooms',
    'room_members',
    'matches',
    'contact_shares',
    'connections',
    'boost_transactions'
  ];
  
  const missingTables = expectedTables.filter(table => 
    !migrationContent.includes(`create table if not exists public.${table}`)
  );
  
  if (missingTables.length === 0) {
    console.log('✅ All expected tables defined in migration');
  } else {
    console.log('❌ Missing table definitions:', missingTables);
  }
  
  // Check for RLS policies
  if (migrationContent.includes('enable row level security')) {
    console.log('✅ Row Level Security policies defined');
  } else {
    console.log('❌ Missing Row Level Security policies');
  }
} else {
  console.log('❌ Migration file not found');
}

// Check schema file
console.log('\n📋 Checking schema definitions...');
if (fs.existsSync('shared/schema.ts')) {
  const schemaContent = fs.readFileSync('shared/schema.ts', 'utf8');
  
  const expectedSchemas = [
    'insertProfileSchema',
    'insertEventSchema',
    'insertMatchRoomSchema',
    'insertMatchSchema',
    'insertContactShareSchema',
    'insertConnectionSchema'
  ];
  
  const missingSchemas = expectedSchemas.filter(schema => 
    !schemaContent.includes(schema)
  );
  
  if (missingSchemas.length === 0) {
    console.log('✅ All NuConnect schemas defined');
  } else {
    console.log('❌ Missing schema definitions:', missingSchemas);
  }
} else {
  console.log('❌ Schema file not found');
}

// Run the Phase 2 verification tests
console.log('\n🧪 Running Phase 2 verification tests...\n');

try {
  execSync('npm run test:phase2', { stdio: 'inherit' });
  console.log('\n✅ Phase 2 verification completed successfully!');
  console.log('\n📋 Phase 2 Summary:');
  console.log('   ✓ Database migration file created');
  console.log('   ✓ NuConnect table schemas defined');
  console.log('   ✓ Row Level Security policies configured');
  console.log('   ✓ Zod validation schemas updated');
  console.log('   ✓ TypeScript types exported');
  console.log('   ✓ Backward compatibility maintained');
  console.log('\n🎯 Ready to proceed to Phase 3: AI service & pipeline');
} catch (error) {
  console.error('\n❌ Phase 2 verification failed!');
  console.error('Please review the test output above and fix any issues before proceeding.');
  console.error('\n💡 Common issues:');
  console.error('   - Missing Supabase environment variables');
  console.error('   - Tables not created in Supabase dashboard');
  console.error('   - Schema validation errors');
  process.exit(1);
}
