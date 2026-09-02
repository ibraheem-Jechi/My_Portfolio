const jobs = [
  {
    role: 'Software Engineer (Full-Stack)',
    company: 'HAUZ — CreatorHQ',
    date: 'Feb 2026 – Present',
    location: 'London, UK (Remote)',
    current: true,
    bullets: [
      'Own the backend for a creator/brand marketplace platform: deals, contracts, invoicing, and revenue tracking — core operational logic used daily by real creators and brands',
      'Architected 170+ production REST API endpoints on a 42-table PostgreSQL (Supabase) schema with Row-Level Security and 123 SQL migrations',
      'Built a multi-provider AI abstraction layer (OpenAI/Groq) powering 9 production AI features, with prompt-injection defense and per-user cost/budget enforcement',
      'Integrated 6+ third-party services (Stripe billing, Calendly, Gmail, Google/Outlook Calendar) through a unified connector architecture',
      'Maintained 184 automated tests (Vitest, Playwright e2e), including concurrency/idempotency coverage that closed real billing race-condition bugs before production',
      'Shipped 14+ features across 3 sprint cycles with zero critical regressions across 123 commits, collaborating within a 5-person engineering team',
    ],
    tags: ['AI / ML', 'PostgreSQL', 'Supabase', 'Node.js', 'Stripe', 'REST APIs'],
  },
  {
    role: 'Backend Engineer',
    company: 'Majlisync AI',
    date: 'Jun 2026 – Present (Part-time)',
    location: 'Remote',
    current: true,
    bullets: [
      'Designed core infrastructure for LATTICE Core, a domain-agnostic multi-agent AI decision pipeline for enterprise governance — full output schema and component contracts for U6 (Shared Case Memory & State Store) and U7 (Human Gate & Finalization)',
      'Resolved cross-unit schema dependencies across a 5-person team, catching field mismatches, type inconsistencies, and missing evidence-traceability links before implementation',
      'Conducted an independent governance review of the WORM enforcement layer, verifying immutability guarantees, version-locking, and audit trail integrity',
      'Built the U6 storage layer in Python (database-enforced WORM, SHA-256 content-hash verification, Case State Store, Evidence Registry, Rehydration Service) and the U7 finalization layer',
      'Conducted structured QA of a Flutter/Firebase mobile app, catching critical bugs including a fabricated-report fallback and a debug keystore shipped on the release build',
    ],
    tags: ['Python', 'PostgreSQL', 'Multi-Agent AI', 'System Architecture', 'QA'],
  },
  {
    role: 'Full-Stack Web Development Intern',
    company: 'UNRWA & Digital Hub',
    date: 'Jul – Dec 2025',
    location: 'On-site',
    bullets: [
      'Built full-stack projects using MERN stack, Laravel, PHP, and MySQL',
      'Developed RESTful APIs via Express.js, Next.js, and Laravel to streamline backend operations',
      'Produced feature-rich dashboards and informative portals for fintech and role-based systems',
      'Operated within Agile SDLC using Jira, sprint reviews, and daily standups',
    ],
    tags: ['MERN', 'Laravel', 'MySQL', 'Next.js', 'Jira'],
  },
  {
    role: 'Junior Software Engineer',
    company: 'Early-Stage Startup (Stealth Mode)',
    date: 'Aug – Dec 2025',
    location: 'Remote',
    bullets: [
      'Developed a cross-platform mobile application using Flutter (Dart)',
      'Implemented UI components and application logic in a fast-paced agile environment',
    ],
    tags: ['Flutter', 'Dart', 'Mobile', 'Agile'],
  },
  {
    role: 'Freelance Web Developer',
    company: 'Self-Employed',
    date: 'Jun 2023 – Present',
    location: 'Remote',
    bullets: [
      'Delivered responsive, user-focused websites and scalable web applications for multiple clients',
      'Collaborated with clients to build tailored solutions using modern technologies',
    ],
    tags: ['React', 'Next.js', 'Node.js', 'Laravel'],
  },
]

export default function Experience() {
  return (
    <section className="section experience-section" id="experience">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Where I&apos;ve Been</span>
          <h2 className="section-title">Experience</h2>
        </div>

        <div className="timeline">
          {jobs.map((job) => (
            <div className="tl-item reveal" key={job.role + job.company}>
              <div className="tl-dot"><div className="tl-dot-inner" /></div>
              <div className="tl-card">
                <div className="tl-head">
                  <div className="tl-info">
                    <div className="tl-role-row">
                      <h3 className="tl-role">{job.role}</h3>
                      {job.current && <div className="tl-badge current">Current</div>}
                    </div>
                    <span className="tl-company">{job.company}</span>
                  </div>
                  <div className="tl-meta">
                    <span className="tl-date">
                      <i className="fas fa-calendar-alt" /> {job.date}
                    </span>
                    <span className="tl-loc">
                      <i className="fas fa-map-marker-alt" /> {job.location}
                    </span>
                  </div>
                </div>
                <ul className="tl-bullets">
                  {job.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <div className="tl-tags">
                  {job.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
