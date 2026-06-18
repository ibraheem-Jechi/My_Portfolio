import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const CONTEXT = `You are an AI assistant on Ibrahim El Jichi's portfolio website. Answer questions about Ibrahim in a warm, professional tone in 2-4 sentences max.

About Ibrahim:
- Full-Stack Software Engineer based in Lebanon, open to remote work and relocation
- Currently Software Engineer at HAUZ (London, UK, remote) — building CreatorHQ, an AI-powered platform for creator business management
- 2+ years of professional experience
- B.Eng. Computer Science & Communication Engineering, Lebanese International University (2020–2024)
- Languages: Arabic, English, French

Key Skills: React, Next.js, TypeScript, Node.js, Express, Laravel, PHP, Flutter, MongoDB, MySQL, Docker, Kubernetes, CI/CD, Anthropic Claude API, OpenAI, Gmail API

Projects:
1. CreatorHQ — AI platform at HAUZ for creator business management (brand deals, contracts, revenue, Gmail automation)
2. Supermarket POS System — Full POS with barcode scanning, multi-role access, sales analytics (MERN)
3. RentHub — Student housing platform (Next.js, React, MongoDB)
4. Digital Hub Website — Admin dashboard with RBAC (Laravel, PHP, MySQL)

Contact: Ibrahimj02@outlook.com | +961 78 860 266 | github.com/ibraheem-Jechi | linkedin.com/in/ibrahim-el-jichi

Rules: Never invent facts. If asked about salary, say Ibrahim is happy to discuss by email. If asked about availability, say yes — he is open to new opportunities.`

const FALLBACK = "Sorry, I couldn't respond right now. Please email Ibrahim at Ibrahimj02@outlook.com."

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const history = (messages as Array<{ role: string; content: string }>)
      .slice(0, -1)
      .map(m => `${m.role === 'user' ? 'Visitor' : 'You'}: ${m.content}`)
      .join('\n')

    const lastQuestion = (messages as Array<{ role: string; content: string }>)[messages.length - 1]?.content ?? ''

    const prompt = history
      ? `${CONTEXT}\n\nConversation so far:\n${history}\n\nVisitor: ${lastQuestion}`
      : `${CONTEXT}\n\nVisitor: ${lastQuestion}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const parts: { text?: string; thought?: boolean }[] =
      response.candidates?.[0]?.content?.parts ?? []
    const text =
      parts
        .filter(p => !p.thought && p.text)
        .map(p => p.text)
        .join('')
        .trim() || FALLBACK

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
