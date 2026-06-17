import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const SYSTEM = `You are an AI assistant for Ibrahim El Jichi's portfolio. Help recruiters and visitors learn about Ibrahim in a friendly, concise, professional way.

About Ibrahim:
- Full-Stack Software Engineer based in Lebanon, open to remote work and relocation
- Currently Software Engineer at HAUZ (London, UK, remote) — building CreatorHQ, an AI-powered platform for creator business management
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
1. CreatorHQ (in progress, private) — AI platform at HAUZ: brand deal tracking, contract handling, revenue monitoring, Gmail integration with intelligent automation workflows. Stack: AI/ML, Node.js, MongoDB, REST APIs, Gmail API.
2. Supermarket POS System — Full POS with barcode scanning, automated billing, multi-role access (Admin/Clerk/Accountant), sales analytics, real-time inventory. Stack: MERN.
3. RentHub — Student housing platform with property listings, search & filtering, user auth. Stack: Next.js, React, MongoDB.
4. Digital Hub Website — Responsive site with admin dashboard and role-based access control. Stack: Laravel, PHP, MySQL.

Contact:
- Email: Ibrahimj02@outlook.com
- Phone: +961 78 860 266
- GitHub: github.com/ibraheem-Jechi
- LinkedIn: linkedin.com/in/ibrahim-el-jichi

Rules:
- Keep every reply to 2–4 sentences maximum. Be warm but professional.
- If asked about salary expectations or very personal topics, say Ibrahim would be happy to discuss those directly by email.
- Never make up facts not listed above.
- If someone asks if Ibrahim is available, say yes — he is open to new opportunities.`

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const history = messages.slice(0, -1).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }))

    const lastMessage = messages[messages.length - 1]

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash-lite',
      config: { systemInstruction: SYSTEM },
      history,
    })

    const result = await chat.sendMessageStream({ message: lastMessage.content })

    const encoder = new TextEncoder()

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result) {
            const text = chunk.text
            if (text) {
              const data = JSON.stringify({ delta: text })
              controller.enqueue(encoder.encode(`data: ${data}\n\n`))
            }
          }
        } catch {
          const err = JSON.stringify({ delta: "Sorry, I couldn't connect right now. Please email Ibrahim at Ibrahimj02@outlook.com." })
          controller.enqueue(encoder.encode(`data: ${err}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (e) {
    console.error('Chat API error:', e)
    return new Response(JSON.stringify({ error: 'AI service unavailable' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
