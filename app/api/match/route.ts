import { GoogleGenAI } from '@google/genai'
import { NextRequest } from 'next/server'

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const IBRAHIM = `
Ibrahim El Jichi — Full-Stack Software Engineer

Skills:
- Frontend: React, Next.js, TypeScript, HTML, CSS, Tailwind
- Backend: Node.js, Express, Laravel, PHP, REST APIs
- Mobile: Flutter, Dart
- Databases: MongoDB, MySQL
- DevOps: Docker, Kubernetes, CI/CD pipelines
- AI/ML: Anthropic Claude API, OpenAI API, Gmail API, AI workflow automation

Experience:
- Software Engineer at HAUZ (London, UK — remote): Building CreatorHQ, an AI-powered platform for content creator business management. Features include brand deal tracking, contract handling, revenue monitoring, and Gmail automation with intelligent AI workflows.

Projects:
- CreatorHQ: AI-powered creator business platform (Node.js, MongoDB, REST APIs, Gmail API, AI/ML)
- Supermarket POS System: Full POS with barcode scanning, multi-role access, sales analytics (MERN stack)
- RentHub: Student housing platform with listings, search, and user auth (Next.js, React, MongoDB)
- Digital Hub Website: Responsive site with admin dashboard and RBAC (Laravel, PHP, MySQL)

Education: B.Eng. Computer Science & Communication Engineering, Lebanese International University (2020–2024)
Location: Lebanon — open to remote and relocation
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
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    console.error('Match API error:', e)
    return new Response(JSON.stringify({ error: 'Analysis failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
