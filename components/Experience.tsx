const jobs = [
  {
    role: 'Software Engineer',
    company: 'HAUZ — CreatorHQ',
    date: 'Apr 2026 – Present',
    location: 'London, UK (Remote)',
    current: true,
    bullets: [
      'Developing an AI-powered platform for creator business management — brand deal tracking, contract handling, and revenue monitoring',
      'Building and maintaining core backend systems including data models, APIs, and business logic for scalable product functionality',
      'Integrating third-party services including Gmail/inbox systems to streamline communication and automation',
      'Contributing to AI-powered intelligent workflows and automation tools in an agile startup environment',
    ],
    tags: ['AI / ML', 'Node.js', 'MongoDB', 'REST APIs', 'GitHub', 'Agile'],
  },
  {
    role: 'Full-Stack Web Development Intern',
    company: 'UNRWA & Digital Hub',
    date: 'Jul – Dec 2025',
    location: 'Remote',
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
                {job.current && <div className="tl-badge current">Current</div>}
                <div className="tl-head">
                  <div className="tl-info">
                    <h3 className="tl-role">{job.role}</h3>
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
