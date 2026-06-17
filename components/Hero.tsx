'use client'
import { useEffect, useState } from 'react'

const phrases = [
  'Software Engineer.',
  'API Builder.',
  'AI Platform Dev.',
  'Next.js Expert.',
  'Problem Solver.',
]

export default function Hero() {
  const [typedText, setTypedText] = useState('')
  const [phraseIdx, setPhraseIdx] = useState(0)
  const [charIdx,   setCharIdx]   = useState(0)
  const [deleting,  setDeleting]  = useState(false)

  useEffect(() => {
    const word = phrases[phraseIdx]
    let timeout: ReturnType<typeof setTimeout>

    if (!deleting) {
      if (charIdx < word.length) {
        timeout = setTimeout(() => {
          setTypedText(word.slice(0, charIdx + 1))
          setCharIdx((c) => c + 1)
        }, 75)
      } else {
        timeout = setTimeout(() => setDeleting(true), 2200)
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setTypedText(word.slice(0, charIdx - 1))
          setCharIdx((c) => c - 1)
        }, 45)
      } else {
        setDeleting(false)
        setPhraseIdx((p) => (p + 1) % phrases.length)
      }
    }

    return () => clearTimeout(timeout)
  }, [charIdx, deleting, phraseIdx])

  return (
    <section className="hero" id="home">
      <div className="hero-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="grid-overlay" />
      </div>

      <div className="hero-content">
        <h1 className="hero-name">
          <span className="name-first">Ibrahim</span>
          <span className="name-last gradient-text">El Jichi</span>
        </h1>

        <p className="hero-role">
          Full-Stack Developer &amp;{' '}
          <span className="typed-text">{typedText}</span>
        </p>

        <p className="hero-desc">
          I build scalable, user-centered web applications and AI-powered products.
          Currently shipping <strong>CreatorHQ</strong> at HAUZ — London, UK.
        </p>

        <div className="hero-cta">
          <a href="#projects" className="btn btn-primary">
            <i className="fas fa-eye" /> View My Work
          </a>
          <a href="#contact" className="btn btn-secondary">
            <i className="fas fa-paper-plane" /> Get In Touch
          </a>
        </div>

        <div className="hero-socials">
          <a href="https://github.com/ibraheem-Jechi" className="social-icon" title="GitHub" target="_blank" rel="noopener">
            <i className="fab fa-github" />
          </a>
          <a href="https://www.linkedin.com/in/ibrahim-el-jichi/" className="social-icon" title="LinkedIn" target="_blank" rel="noopener">
            <i className="fab fa-linkedin-in" />
          </a>
          <a href="mailto:Ibrahimj02@outlook.com" className="social-icon" title="Email">
            <i className="fas fa-envelope" />
          </a>
          <a href="tel:+96178860266" className="social-icon" title="Phone">
            <i className="fas fa-phone" />
          </a>
        </div>
      </div>

      <div className="scroll-hint">
        <div className="mouse"><div className="wheel" /></div>
        <span>Scroll</span>
      </div>
    </section>
  )
}
