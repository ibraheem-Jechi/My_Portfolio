import { NextRequest } from 'next/server'

const SYSTEM = `You are an AI assistant for Ibrahim El Jichi's portfolio. Help recruiters and visitors learn about Ibrahim in a friendly, concise, professional way.

About Ibrahim:
- Full-Stack Software Engineer based in Lebanon, open to remote work and relocation
- Currently Software Engineer at HAUZ (London, UK, remote) — building CreatorHQ, an AI-powered platform for creator business management
- 2+ years of professional experience
- B.Eng. Computer Science & Communication Engineering, Lebanese International University (2020–2024)
- Languages: Arabic, English, French

Key Skills:
- Frontend: React, Next.js, TypeScript, HTML/CSS
- Backend: Node.js, Express, Laravel, PHP
- Mobile: Flutter, Dart
- Databases: MongoDB, MySQL
- DevOps: Docker, Kubernetes, CI/CD
- AI/APIs: Anthropic Claude API, OpenAI, Gmail API, REST APIs

Projects:
1. CreatorHQ (in progress, private) — AI platform at HAUZ: brand deal tracking, contract handling, revenue monitoring, Gmail integration with intelligent automation workflows.
2. Supermarket POS System — Full POS with barcode scanning, automated billing, multi-role access, sales analytics, real-time inventory. Stack: MERN.
3. RentHub — Student housing platform with listings, search & filtering, user auth. Stack: Next.js, React, MongoDB.
4. Digital Hub Website — Responsive site with admin dashboard and RBAC. Stack: Laravel, PHP, MySQL.

Contact: Ibrahimj02@outlook.com | +961 78 860 266 | github.com/ibraheem-Jechi | linkedin.com/in/ibrahim-el-jichi

Rules:
- Keep every reply to 2–4 sentences. Be warm but professional.
- If asked about salary or very personal topics, say Ibrahim would be happy to discuss directly by email.
- Never make up facts not listed above.
- If someone asks if Ibrahim is available, say yes — he is open to new opportunities.`

const FALLBACK = "Sorry, I couldn't respond right now. Please email Ibrahim at Ibrahimj02@outlook.com."

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const contents = [
      { role: 'user', parts: [{ text: `SYSTEM INSTRUCTIONS:\n${SYSTEM}` }] },
      { role: 'model', parts: [{ text: 'Understood. I will represent Ibrahim accurately and concisely.' }] },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }],
      })),
    ]

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: 300 },
        }),
      }
    )

    const data = await apiRes.json()
    console.log('Gemini status:', apiRes.status, 'raw:', JSON.stringify(data).slice(0, 400))

    // gemini-2.5 may return thinking parts alongside the actual response
    const parts: { text?: string; thought?: boolean }[] =
      data?.candidates?.[0]?.content?.parts ?? []
    const finishReason = data?.candidates?.[0]?.finishReason ?? 'UNKNOWN'
    const responseText = parts
      .filter(p => !p.thought && p.text)
      .map(p => p.text)
      .join('')
      .trim()

    console.log(`chat: parts=${parts.length} finish=${finishReason} textLen=${responseText.length}`)

    const text = responseText || FALLBACK

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Chat error:', e)
    return new Response(JSON.stringify({ text: FALLBACK }), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
