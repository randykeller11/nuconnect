export type ORMessage = { role:'system'|'user'|'assistant'; content:string }

const OR_BASE = 'https://openrouter.ai/api/v1'

export async function explainMatchLLM(
  payload: { me: any; other: any; score: number },
  model = 'openai/gpt-4o-mini'
) {
  if (!process.env.OPENROUTER_API_KEY) return null

  const prompt = `Write a 1-2 sentence, professional rationale for why ME should connect with OTHER, based on overlap and complementary goals. Only use provided facts. Keep <= 160 chars.
ME: ${JSON.stringify(payload.me)}
OTHER: ${JSON.stringify(payload.other)}
SCORE: ${payload.score}`

  const res = await fetch(`${OR_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 80,
    }),
  })
  const json = await res.json()
  return json?.choices?.[0]?.message?.content?.trim() ?? null
}

export async function openrouterChat(
  messages: ORMessage[],
  model = 'openai/gpt-4o-mini',
  temperature = 0.2
){
  const key = process.env.OPENROUTER_API_KEY
  if (!key) throw new Error('OPENROUTER_API_KEY missing')
  
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature })
  })
  if (!res.ok) throw new Error(`OpenRouter ${res.status}: ${await res.text()}`)
  const json = await res.json()
  return json?.choices?.[0]?.message?.content?.toString() ?? ''
}
