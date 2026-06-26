import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const CONTEXT = `You are an AI assistant on Ibrahim El Jichi's portfolio website. Answer questions about Ibrahim in a warm, professional tone in 2-4 sentences max.

About Ibrahim:
- Full-Stack Software Engineer (Backend & API Architecture, AI-Powered Platforms) based in Beirut, Lebanon, open to remote work and relocation
- Currently Software Engineer at HAUZ (London, UK, remote) — building CreatorHQ since February 2026
- 2+ years of professional experience (plus freelancing since June 2023)
- B.Eng. Computer Science & Communication Engineering, Lebanese International University (March 2020 – June 2024)
- Languages: Arabic (native), English (fluent), French (conversational)

Current Role — HAUZ / CreatorHQ (Feb 2026 – Present):
- Architected 88+ production RESTful API endpoints across 10 modules (Node.js, Express.js, TypeScript)
- Integrated 6 social platforms via Nango: YouTube, Instagram, TikTok, Twitter/X, LinkedIn, Pinterest — full OAuth + token refresh
- Owned end-to-end Gmail API integration (8 endpoints) — auto-import, thread sync, send/reply, discrepancy detection
- Designed MongoDB schemas for full creator lifecycle: deals, contracts, media kits, social accounts
- Applied SOLID principles and MVC/Repository patterns; shipped 14+ features in 3 sprint cycles across 123 commits
- Works in a 5-person engineering team; coordinates via GitHub PRs and Trello sprint boards

Previous — Full-Stack Web Development Intern, UNRWA & Digital Hub (Jul–Dec 2025):
- Delivered 5 full-stack projects and 9 dashboards using MERN, Laravel, PHP, MySQL
- Designed and deployed 100+ RESTful API endpoints with JWT auth and multi-role authorization
- Built 4-tier admin access control (Super Admin, Admin, Manager, Staff)

Certifications:
- Full-Stack Development Bootcamp · SeFactory (FCS) · May–Aug 2025
- Network & Telecommunications / CCNA Fundamentals · Feb–Apr 2022

Key Skills:
- Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS
- Backend: Node.js, Express.js, Laravel, PHP, Python, RESTful API Design, JWT, OAuth
- Databases: MongoDB, MySQL, schema design, query optimization
- DevOps: Docker, Kubernetes, CI/CD, GitHub Actions, Postman, Swagger
- Architecture: SOLID, MVC, Repository Pattern, Agile/Scrum
- Mobile: Flutter, Dart

Projects:
1. CreatorHQ — AI platform at HAUZ for creator business management (brand deals, contracts, Gmail API, social platforms, Node.js, MongoDB, TypeScript)
2. Supermarket POS System — Full POS with barcode scanning, multi-role access, real-time sales analytics, atomic MongoDB ops for race condition prevention (MERN)
3. RentHub — Student housing marketplace with SSR for SEO, Vercel CI/CD (Next.js, React, MongoDB)
4. Blood Bank Donation System — Donor registration, eligibility checker, appointment scheduling, QR code scanning, email reminders (HTML5, JS, CSS3)
5. Digital Hub Website — Responsive site with admin dashboard and RBAC (Laravel, PHP, MySQL)

Contact: Ibrahimj02@outlook.com | +961 78 860 266 | github.com/ibraheem-Jechi | linkedin.com/in/ibrahim-el-jichi

Rules: Never invent facts. If asked about salary, say Ibrahim is happy to discuss by email. If asked about availability, say yes — he is actively open to new opportunities.`

const FALLBACK = "Sorry, I couldn't respond right now. Please email Ibrahim at Ibrahimj02@outlook.com."

async function callGemini(prompt: string): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      })

      const parts: { text?: string; thought?: boolean }[] =
        response.candidates?.[0]?.content?.parts ?? []

      // Prefer non-thought parts; fall back to any text part (handles thinking models)
      const text =
        parts.filter(p => !p.thought && p.text).map(p => p.text).join('').trim() ||
        parts.filter(p => p.text).map(p => p.text).join('').trim()

      if (text) return text
      throw new Error('Empty response from model')
    } catch (e) {
      console.error(`Chat attempt ${attempt} failed:`, e)
      if (attempt < 3) await new Promise(r => setTimeout(r, 400 * attempt))
      else throw e
    }
  }
  throw new Error('All retries exhausted')
}

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

    const text = await callGemini(prompt)

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e) {
    console.error('Chat error (all retries failed):', e)
    return new Response(JSON.stringify({ text: FALLBACK }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
