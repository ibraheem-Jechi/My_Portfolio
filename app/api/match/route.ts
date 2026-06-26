import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const IBRAHIM = `
Ibrahim El Jichi — Full-Stack Software Engineer (Backend & API Architecture · AI-Powered Platforms)

Skills:
- Frontend: React, Next.js, TypeScript, JavaScript (ES6+), HTML5, CSS3, Tailwind CSS, Bootstrap, Context API
- Backend: Node.js, Express.js, PHP, Laravel, Python, RESTful API Design, JWT, OAuth
- Databases: MongoDB, MySQL, Schema Design, Query Optimization
- DevOps: Docker, Kubernetes, CI/CD Pipelines, GitHub Actions, Postman, Swagger
- Architecture: SOLID Principles, MVC, Repository Pattern, Agile/Scrum, System Design
- Mobile: Flutter, Dart
- Tools: Figma, Jira, Trello, ClickUp

Experience:
- Software Engineer at HAUZ / CreatorHQ (London, UK — remote, Feb 2026–Present): Architected 88+ production RESTful API endpoints across 10 modules using Node.js, Express.js, TypeScript. Integrated 6 social platforms via Nango (YouTube, Instagram, TikTok, Twitter/X, LinkedIn, Pinterest). Owned Gmail API integration (8 endpoints). Applied SOLID/MVC/Repository patterns. 123 commits across 3 sprint cycles.
- Full-Stack Web Development Intern, UNRWA & Digital Hub (Jul–Dec 2025): Delivered 5 full-stack projects and 9 dashboards using MERN, Laravel, PHP, MySQL. Deployed 100+ RESTful API endpoints with JWT auth and 4-tier RBAC.
- Freelance Web Developer (Jun 2023–Present): 3+ client projects using React, Node.js, MySQL.

Projects:
- CreatorHQ: AI-powered creator management platform (Node.js, Express.js, MongoDB, TypeScript, Nango, Gmail API)
- Supermarket POS System: Full POS with barcode scanning, atomic MongoDB ops, multi-role access (MERN)
- RentHub: Student housing marketplace with SSR/SEO, Vercel CI/CD (Next.js, React, MongoDB)
- Blood Bank Donation System: Donor registration, eligibility checker, QR code scanning, email reminders (HTML5, JS, CSS3)
- Digital Hub Website: Responsive site with admin dashboard and RBAC (Laravel, PHP, MySQL)

Certifications: Full-Stack Development Bootcamp · SeFactory (FCS) · 2025 | CCNA Fundamentals · 2022
Education: B.Eng. Computer Science & Communication Engineering, Lebanese International University (2020–2024)
Location: Beirut, Lebanon — open to remote and relocation
`

export async function POST(req: NextRequest) {
  try {
    const { jobDescription } = await req.json()

    if (!jobDescription?.trim()) {
      return new Response(JSON.stringify({ error: 'Missing job description' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const prompt = `You are a technical recruiter AI analyzing a candidate's fit for a job.

CANDIDATE PROFILE:
${IBRAHIM}

JOB DESCRIPTION:
${jobDescription.slice(0, 3000)}

Analyze the match and respond with ONLY a valid JSON object — no markdown, no explanation, no code fences:
{
  "score": <integer 0-100 representing overall match percentage>,
  "matchingSkills": [<array of up to 6 specific skills from the candidate that match the job requirements>],
  "relevantProjects": [<array of up to 3 of the candidate's projects most relevant to this job — use exact project names>],
  "pitch": "<2-3 sentence pitch addressed to the hiring manager explaining why Ibrahim is a strong fit for this specific role, referencing specific requirements from the job description>"
}`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    })

    const rawText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? ''

    const jsonMatch = rawText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON in response')

    const parsed = JSON.parse(jsonMatch[0])

    const safe = {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      matchingSkills: Array.isArray(parsed.matchingSkills) ? parsed.matchingSkills.slice(0, 6) : [],
      relevantProjects: Array.isArray(parsed.relevantProjects) ? parsed.relevantProjects.slice(0, 3) : [],
      pitch: typeof parsed.pitch === 'string' ? parsed.pitch : '',
    }

    return new Response(JSON.stringify(safe), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  } catch (e) {
    console.error('Match API error:', e)
    return new Response(JSON.stringify({ error: 'Analysis failed' }), {
      status: 500,
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
