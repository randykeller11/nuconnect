// Simple test to verify OpenRouter connection
require('dotenv').config({ path: '.env.local' });

async function testOpenRouter() {
  console.log('Testing OpenRouter connection...');
  console.log('API Key configured:', !!process.env.OPENROUTER_API_KEY);
  console.log('API Key starts with:', process.env.OPENROUTER_API_KEY?.substring(0, 15) + '...');
  
  try {
    // Test the actual fetch call to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'user', content: 'Say "Hello, OpenRouter is working!" and nothing else.' }
        ],
        temperature: 0.2
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter ${response.status}: ${errorText}`);
    }
    
    const json = await response.json();
    const content = json?.choices?.[0]?.message?.content || '';
    
    console.log('✅ OpenRouter test successful!');
    console.log('Response:', content);
    console.log('Full response object:', JSON.stringify(json, null, 2));
    
  } catch (error) {
    console.log('❌ OpenRouter test failed:');
    console.error(error.message);
    
    if (error.message.includes('401')) {
      console.log('\n🔑 This looks like an API key issue. Please:');
      console.log('1. Go to https://openrouter.ai/keys');
      console.log('2. Create a new API key');
      console.log('3. Replace the value in your env.local file');
    } else if (error.message.includes('fetch')) {
      console.log('\n🌐 Network issue. Make sure you have internet connection.');
    }
  }
}

testOpenRouter();
