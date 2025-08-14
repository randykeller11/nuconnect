// Simple test to verify OpenRouter connection
const { openrouterChat } = require('./lib/ai/openrouter');

async function testOpenRouter() {
  console.log('Testing OpenRouter connection...');
  console.log('API Key configured:', !!process.env.OPENROUTER_API_KEY);
  console.log('API Key value:', process.env.OPENROUTER_API_KEY?.substring(0, 10) + '...');
  
  try {
    const response = await openrouterChat([
      { role: 'user', content: 'Say "Hello, OpenRouter is working!" and nothing else.' }
    ]);
    
    console.log('✅ OpenRouter test successful!');
    console.log('Response:', response);
  } catch (error) {
    console.log('❌ OpenRouter test failed:');
    console.error(error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 This looks like an API key issue. Please:');
      console.log('1. Go to https://openrouter.ai/keys');
      console.log('2. Create a new API key');
      console.log('3. Replace the value in your env.local file');
    }
  }
}

testOpenRouter();
