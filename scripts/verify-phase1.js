#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Phase 1: Foundation Pruning...\n');

// Check if required test dependencies are installed
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const hasJest = packageJson.devDependencies?.jest || packageJson.dependencies?.jest;

if (!hasJest) {
  console.log('📦 Installing test dependencies...');
  try {
    execSync('npm install --save-dev jest @testing-library/jest-dom @testing-library/react jest-environment-jsdom', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Failed to install test dependencies');
    process.exit(1);
  }
}

// Run the Phase 1 verification tests
console.log('🧪 Running Phase 1 verification tests...\n');

try {
  execSync('npm run test:phase1', { stdio: 'inherit' });
  console.log('\n✅ Phase 1 verification completed successfully!');
  console.log('\n📋 Phase 1 Summary:');
  console.log('   ✓ Matrimoney-specific files removed');
  console.log('   ✓ Core infrastructure preserved');
  console.log('   ✓ NuConnect branding applied');
  console.log('   ✓ Database schema updated');
  console.log('   ✓ Color palette updated');
  console.log('   ✓ Admin dashboards updated');
  console.log('\n🎯 Ready to proceed to Phase 2: Database migrations');
} catch (error) {
  console.error('\n❌ Phase 1 verification failed!');
  console.error('Please review the test output above and fix any issues before proceeding.');
  process.exit(1);
}
