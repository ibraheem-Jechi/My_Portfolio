'use client'
import { useState } from 'react'

export default function About() {
  const [photoError, setPhotoError] = useState(false)

  return (
    <section className="section about-section" id="about">
      <div className="container">
        <div className="section-header reveal">
          <span className="section-label">Who I Am</span>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about-grid">
          {/* Photo */}
          <div className="about-photo-wrap reveal">
            <div className="photo-frame">
              {!photoError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/assets/profile.jpg"
                  alt="Ibrahim El Jichi"
                  className="profile-photo"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="photo-fallback">IEJ</div>
              )}
            </div>
            <div className="photo-decoration">
              <div className="deco-ring deco-ring-1" />
              <div className="deco-ring deco-ring-2" />
            </div>
            <div className="availability-badge">
              <span className="status-dot" /> Open to Work
            </div>
          </div>

          {/* Text */}
          <div className="about-text reveal">
            <p>
              I&apos;m a <strong>full-stack developer</strong> with a B.Eng. in Computer Science
              and Communication Engineering from Lebanese International University. I&apos;m
              passionate about building products that are technically solid and genuinely useful.
            </p>
            <p>
              Currently at <strong>HAUZ</strong> (London), I&apos;m developing{' '}
              <strong>CreatorHQ</strong> — an AI-powered platform for creator business management
              including brand deal tracking, contracts, and revenue monitoring. I specialize in the{' '}
              <strong>MERN stack</strong>, Next.js, and Laravel.
            </p>
            <p>
              I thrive at the intersection of clean architecture, thoughtful design, and scalable
              systems. Beyond code, I&apos;ve mentored students, volunteered in humanitarian
              initiatives, and worked across fast-paced startup environments.
            </p>

            <div className="about-meta">
              <div className="meta-item">
                <i className="fas fa-map-marker-alt" />
                <span>Lebanon — Open to Remote &amp; Relocation</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-graduation-cap" />
                <span>B.Eng. Computer Science &amp; Comm. Engineering</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-language" />
                <span>Arabic · English · French</span>
              </div>
            </div>

            <div className="about-actions">
              <a href="/Ibrahim-El-Jichi-MyCV.pdf" className="btn btn-primary" download>
                <i className="fas fa-download" /> Download CV
              </a>
              <a href="#contact" className="btn-ghost">Let&apos;s Talk</a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[
            { target: 2,  plus: '+', label: 'Years Experience' },
            { target: 10, plus: '+', label: 'Projects Shipped' },
            { target: 8,  plus: '+', label: 'Tech Stacks' },
            { target: 3,  plus: '',  label: 'Languages Spoken' },
          ].map(({ target, plus, label }) => (
            <div className="stat-card reveal" key={label}>
              <span className="stat-num" data-target={target}>{target}</span>
              <span className="stat-plus">{plus}</span>
              <span className="stat-lbl">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
