#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verifying Phase 3: AI Service & Pipeline...\n');

// Check if OpenRouter API key is set
console.log('📋 Checking environment variables...');
if (!process.env.OPENROUTER_API_KEY) {
  console.log('⚠️  Missing OPENROUTER_API_KEY environment variable');
  console.log('💡 Please set this in your .env.local file');
} else {
  console.log('✅ OPENROUTER_API_KEY is configured');
}

// Check if AI service files exist
console.log('\n📁 Checking AI service files...');
const aiFiles = [
  'lib/ai/openrouter.ts'
];

const missingAiFiles = aiFiles.filter(file => !fs.existsSync(file));
if (missingAiFiles.length === 0) {
  console.log('✅ All AI service files exist');
} else {
  console.log('❌ Missing AI service files:', missingAiFiles);
}

// Check if pipeline files exist
console.log('\n📁 Checking pipeline files...');
const pipelineFiles = [
  'lib/pipeline/session.ts',
  'lib/pipeline/stateMachine.ts',
  'lib/pipeline/match-heuristic.ts'
];

const missingPipelineFiles = pipelineFiles.filter(file => !fs.existsSync(file));
if (missingPipelineFiles.length === 0) {
  console.log('✅ All pipeline files exist');
} else {
  console.log('❌ Missing pipeline files:', missingPipelineFiles);
}

// Check if prompt templates exist
console.log('\n📁 Checking prompt templates...');
const promptFiles = [
  'prompts/intake.yaml',
  'prompts/match.yaml'
];

const missingPromptFiles = promptFiles.filter(file => !fs.existsSync(file));
if (missingPromptFiles.length === 0) {
  console.log('✅ All prompt template files exist');
} else {
  console.log('❌ Missing prompt template files:', missingPromptFiles);
}

// Check prompt template content
if (fs.existsSync('prompts/intake.yaml')) {
  const intakeContent = fs.readFileSync('prompts/intake.yaml', 'utf8');
  if (intakeContent.includes('system_prompt') && intakeContent.includes('base_questions')) {
    console.log('✅ Intake prompt template has required structure');
  } else {
    console.log('❌ Intake prompt template missing required sections');
  }
}

if (fs.existsSync('prompts/match.yaml')) {
  const matchContent = fs.readFileSync('prompts/match.yaml', 'utf8');
  if (matchContent.includes('system_prompt') && matchContent.includes('matching_criteria')) {
    console.log('✅ Match prompt template has required structure');
  } else {
    console.log('❌ Match prompt template missing required sections');
  }
}

// Check AI service implementation
console.log('\n📋 Checking AI service implementation...');
if (fs.existsSync('lib/ai/openrouter.ts')) {
  const openrouterContent = fs.readFileSync('lib/ai/openrouter.ts', 'utf8');
  
  const requiredExports = ['openrouterChat', 'ORMessage'];
  const missingExports = requiredExports.filter(exp => !openrouterContent.includes(exp));
  
  if (missingExports.length === 0) {
    console.log('✅ OpenRouter service exports all required functions');
  } else {
    console.log('❌ Missing OpenRouter exports:', missingExports);
  }
  
  if (openrouterContent.includes('OPENROUTER_API_KEY')) {
    console.log('✅ OpenRouter service checks for API key');
  } else {
    console.log('❌ OpenRouter service missing API key check');
  }
}

// Check pipeline implementation
console.log('\n📋 Checking pipeline implementation...');
if (fs.existsSync('lib/pipeline/stateMachine.ts')) {
  const stateMachineContent = fs.readFileSync('lib/pipeline/stateMachine.ts', 'utf8');
  
  const requiredClasses = ['IntakeStateMachine'];
  const missingClasses = requiredClasses.filter(cls => !stateMachineContent.includes(cls));
  
  if (missingClasses.length === 0) {
    console.log('✅ State machine implementation exists');
  } else {
    console.log('❌ Missing state machine classes:', missingClasses);
  }
}

if (fs.existsSync('lib/pipeline/match-heuristic.ts')) {
  const heuristicContent = fs.readFileSync('lib/pipeline/match-heuristic.ts', 'utf8');
  
  const requiredClasses = ['MatchingHeuristic'];
  const missingClasses = requiredClasses.filter(cls => !heuristicContent.includes(cls));
  
  if (missingClasses.length === 0) {
    console.log('✅ Matching heuristic implementation exists');
  } else {
    console.log('❌ Missing matching heuristic classes:', missingClasses);
  }
}

// Run the Phase 3 verification tests
console.log('\n🧪 Running Phase 3 verification tests...\n');

try {
  execSync('npm run test:phase3', { stdio: 'inherit' });
  console.log('\n✅ Phase 3 verification completed successfully!');
  console.log('\n📋 Phase 3 Summary:');
  console.log('   ✓ OpenRouter AI service implemented');
  console.log('   ✓ Session management system created');
  console.log('   ✓ Intake state machine functional');
  console.log('   ✓ Matching heuristic algorithm implemented');
  console.log('   ✓ Prompt templates configured');
  console.log('   ✓ All tests passing');
  console.log('\n🎯 Ready to proceed to Phase 4: API routes & UI');
} catch (error) {
  console.error('\n❌ Phase 3 verification failed!');
  console.error('Please review the test output above and fix any issues before proceeding.');
  console.error('\n💡 Common issues:');
  console.error('   - Missing OPENROUTER_API_KEY environment variable');
  console.error('   - AI service implementation errors');
  console.error('   - Pipeline logic bugs');
  console.error('   - Missing or malformed prompt templates');
  process.exit(1);
}
