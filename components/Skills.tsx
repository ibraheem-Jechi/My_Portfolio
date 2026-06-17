const categories = [
  {
    icon: 'fas fa-layer-group',
    title: 'Frontend',
    tags: [
      { label: 'React',       primary: true },
      { label: 'Next.js',     primary: true },
      { label: 'JavaScript' },
      { label: 'HTML5' },
      { label: 'CSS3' },
      { label: 'Tailwind CSS' },
      { label: 'Bootstrap' },
    ],
  },
  {
    icon: 'fas fa-server',
    title: 'Backend',
    tags: [
      { label: 'Node.js',   primary: true },
      { label: 'Express.js', primary: true },
      { label: 'Laravel',   primary: true },
      { label: 'PHP' },
      { label: 'Python' },
      { label: 'Java' },
      { label: 'REST APIs' },
    ],
  },
  {
    icon: 'fas fa-database',
    title: 'Database',
    tags: [
      { label: 'MongoDB', primary: true },
      { label: 'MySQL',   primary: true },
      { label: 'Mongoose' },
      { label: 'MERN' },
      { label: 'LAMP' },
    ],
  },
  {
    icon: 'fas fa-cloud',
    title: 'DevOps & Tools',
    tags: [
      { label: 'Docker',     accent: true },
      { label: 'Kubernetes', accent: true },
      { label: 'CI/CD',      accent: true },
      { label: 'Git / GitHub' },
      { label: 'Postman' },
      { label: 'Swagger' },
    ],
  },
  {
    icon: 'fas fa-mobile-alt',
    title: 'Mobile',
    tags: [
      { label: 'Flutter', primary: true },
      { label: 'Dart' },
    ],
  },
  {
    icon: 'fas fa-tasks',
    title: 'Project Management',
    tags: [
      { label: 'Jira' },
      { label: 'Trello' },
      { label: 'ClickUp' },
      { label: 'Figma' },
      { label: 'Agile / Scrum' },
    ],
  },
]

export default function Skills() {
  return (
    <section className="section skills-section" id="skills">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">What I Know</span>
          <h2 className="section-title">Skills &amp; Tech Stack</h2>
        </div>
        <div className="skills-grid">
          {categories.map((cat) => (
            <div className="skill-cat reveal" key={cat.title}>
              <div className="skill-cat-header">
                <div className="skill-cat-icon">
                  <i className={cat.icon} />
                </div>
                <h3>{cat.title}</h3>
              </div>
              <div className="skill-tags">
                {cat.tags.map((t) => (
                  <span
                    key={t.label}
                    className={`tag${(t as any).primary ? ' tag-primary' : (t as any).accent ? ' tag-accent' : ''}`}
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
