export type ORMessage = { role:'system'|'user'|'assistant'; content:string }

const OR_BASE = 'https://openrouter.ai/api/v1'

export async function explainMatchLLM(
  payload: { me: any; other: any; score: number },
  model = 'openai/gpt-4o-mini'
) {
  if (!process.env.OPENROUTER_API_KEY) {
    console.log('OPENROUTER_API_KEY not found, using fallback rationale')
    return null
  }

  const prompt = `Write a compelling 1-2 sentence rationale for why these two professionals should connect. Focus on specific shared interests, complementary skills, or collaboration opportunities. Be conversational and specific. Keep under 140 characters.

Person A: ${JSON.stringify(payload.me, null, 2)}
Person B: ${JSON.stringify(payload.other, null, 2)}
Match Score: ${payload.score}%

Examples:
- "You both work in AI and share interests in machine learning - great potential for technical collaboration."
- "Your product management experience could complement their engineering background in fintech."
- "Both passionate about sustainability and have complementary skills in policy and technology."`

  try {
    const res = await fetch(`${OR_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'NuConnect Matching'
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 60,
      }),
    })

    if (!res.ok) {
      console.error('OpenRouter API error:', res.status, await res.text())
      return null
    }

    const json = await res.json()
    const content = json?.choices?.[0]?.message?.content?.trim()
    
    if (content && content.length > 10) {
      return content
    }
    
    return null
  } catch (error) {
    console.error('OpenRouter request failed:', error)
    return null
  }
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
