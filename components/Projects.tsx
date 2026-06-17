const projects = [
  {
    name: 'CreatorHQ',
    visual: 'vis-purple',
    icon: 'fas fa-robot',
    badge: 'In Progress',
    private: true,
    desc: 'AI-powered platform for creator business management at HAUZ. Supports brand deal tracking, contract handling, revenue monitoring, and Gmail integration with intelligent automation workflows.',
    stack: ['AI/ML', 'Node.js', 'MongoDB', 'REST APIs', 'Gmail API'],
    featured: true,
  },
  {
    name: 'Supermarket POS System',
    visual: 'vis-teal',
    icon: 'fas fa-cash-register',
    github: 'https://github.com/ibraheem-Jechi/POS-Supermarket',
    desc: 'Full POS application with barcode scanning, automated billing, multi-role access (Admin, Clerk, Accountant), sales analytics dashboard, and real-time inventory management.',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
  },
  {
    name: 'RentHub',
    visual: 'vis-indigo',
    icon: 'fas fa-home',
    github: 'https://github.com/Hassan222-pixel/RentHub',
    desc: 'Student dormitory & housing platform for browsing and renting rooms near universities. Features property listings, search & filtering, and user authentication.',
    stack: ['Next.js', 'React', 'MongoDB'],
  },
  {
    name: 'Digital Hub Website',
    visual: 'vis-navy',
    icon: 'fas fa-globe',
    github: 'https://github.com/ibraheem-Jechi/The-Digital-Hub-Website',
    desc: 'Fully responsive informative website with an admin dashboard featuring role-based access control for seamless content management.',
    stack: ['Laravel', 'PHP', 'MySQL'],
  },
]

export default function Projects() {
  return (
    <section className="section projects-section" id="projects">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">What I&apos;ve Built</span>
          <h2 className="section-title">Projects</h2>
        </div>

        <div className="projects-grid">
          {projects.map((p) => (
            <div
              key={p.name}
              className={`project-card reveal${p.featured ? ' project-featured' : ''}`}
            >
              <div className={`project-visual ${p.visual}`}>
                <div className="project-gfx">
                  <div className="gfx-icon"><i className={p.icon} /></div>
                  <div className="gfx-ring" />
                  {p.featured && <div className="gfx-ring gfx-ring-2" />}
                </div>
              </div>

              <div className="project-body">
                <div className="project-top">
                  <div>
                    {p.badge && (
                      <span className="project-badge badge-live">{p.badge}</span>
                    )}
                    <h3 className="project-name">{p.name}</h3>
                  </div>
                  <div className="project-links">
                    {p.private ? (
                      <span className="project-link-placeholder" title="Private repo">
                        <i className="fas fa-lock" />
                      </span>
                    ) : (
                      <a href={p.github} className="proj-link" title="GitHub" target="_blank" rel="noopener">
                        <i className="fab fa-github" />
                      </a>
                    )}
                  </div>
                </div>
                <p className="project-desc">{p.desc}</p>
                <div className="project-stack">
                  {p.stack.map((s) => <span key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
