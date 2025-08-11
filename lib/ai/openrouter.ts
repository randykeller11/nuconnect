export type ORMessage = { role: 'system'|'user'|'assistant'; content: string };

export async function openrouterChat(
  messages: ORMessage[], 
  model = 'openai/gpt-4o-mini', 
  temperature = 0.2
): Promise<string> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error('OPENROUTER_API_KEY missing');
  
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${key}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({ model, messages, temperature })
  });
  
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter ${res.status}: ${errorText}`);
  }
  
  const json = await res.json();
  return json?.choices?.[0]?.message?.content ?? '';
}
