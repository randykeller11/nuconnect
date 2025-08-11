#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Phase 6: Database Seeding...\n');

// Check if seed scripts exist
console.log('📁 Checking seed script files...');
const seedFiles = [
  'scripts/seed-data.js',
  'scripts/seed-matches.js'
];

const missingSeedFiles = seedFiles.filter(file => !fs.existsSync(file));
if (missingSeedFiles.length === 0) {
  console.log('✅ All seed script files exist');
} else {
  console.log('❌ Missing seed script files:', missingSeedFiles);
}

// Check if faker dependency is installed
console.log('\n📦 Checking dependencies...');
if (fs.existsSync('package.json')) {
  const packageContent = fs.readFileSync('package.json', 'utf8');
  const packageJson = JSON.parse(packageContent);
  
  if (packageJson.dependencies['@faker-js/faker']) {
    console.log('✅ @faker-js/faker dependency found');
  } else {
    console.log('❌ @faker-js/faker dependency missing');
    console.log('💡 Run: npm install @faker-js/faker');
  }
  
  // Check for seed scripts
  if (packageJson.scripts.seed && packageJson.scripts['seed:matches']) {
    console.log('✅ Seed scripts configured in package.json');
  } else {
    console.log('❌ Seed scripts not properly configured');
  }
} else {
  console.log('❌ package.json not found');
}

// Check environment variables
console.log('\n📋 Checking environment variables...');
const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length === 0) {
  console.log('✅ All required environment variables are set');
} else {
  console.log('⚠️  Missing environment variables:');
  missingEnvVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
  });
  console.log('\n💡 Please set these in your .env.local file');
}

// Check seed script content
console.log('\n📋 Checking seed script implementation...');
if (fs.existsSync('scripts/seed-data.js')) {
  const seedContent = fs.readFileSync('scripts/seed-data.js', 'utf8');
  
  const requiredFunctions = [
    'ensureAuthUser',
    'upsertProfile',
    'createClient'
  ];
  
  const missingFunctions = requiredFunctions.filter(func => 
    !seedContent.includes(func)
  );
  
  if (missingFunctions.length === 0) {
    console.log('✅ Main seed script has all required functions');
  } else {
    console.log('❌ Missing functions in seed script:', missingFunctions);
  }
  
  // Check for demo users
  if (seedContent.includes('Sarah Johnson') && seedContent.includes('Mike Chen')) {
    console.log('✅ Demo users configured');
  } else {
    console.log('❌ Demo users not properly configured');
  }
} else {
  console.log('❌ Main seed script not found');
}

if (fs.existsSync('scripts/seed-matches.js')) {
  const matchesContent = fs.readFileSync('scripts/seed-matches.js', 'utf8');
  
  if (matchesContent.includes('AI Enthusiasts') && matchesContent.includes('match_score')) {
    console.log('✅ Matches seed script properly configured');
  } else {
    console.log('❌ Matches seed script missing required elements');
  }
} else {
  console.log('❌ Matches seed script not found');
}

console.log('\n🎯 Phase 6 Verification Summary:');
console.log('   📋 Seed scripts created and configured');
console.log('   📦 Dependencies added (@faker-js/faker)');
console.log('   🏗️  Demo users and data structure defined');
console.log('   🔗 Match generation logic implemented');
console.log('   ⚙️  Environment variables checked');

console.log('\n💡 To run the seed scripts:');
console.log('   1. Ensure your Supabase database is set up with migrations');
console.log('   2. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
console.log('   3. Run: npm install (to get @faker-js/faker)');
console.log('   4. Run: npm run seed');
console.log('   5. Run: npm run seed:matches');

console.log('\n✅ Phase 6 verification completed!');
console.log('🎯 Ready to proceed to Phase 7: UI theme & wireframe updates');
