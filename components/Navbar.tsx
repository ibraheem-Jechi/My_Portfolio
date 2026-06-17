'use client'
import { useEffect, useState } from 'react'

const links = ['about', 'skills', 'experience', 'projects', 'contact']

export default function Navbar() {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [activeId, setActiveId]   = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)

      const sections = document.querySelectorAll<HTMLElement>('section[id]')
      const y = window.scrollY + 100
      sections.forEach((sec) => {
        if (y >= sec.offsetTop && y < sec.offsetTop + sec.offsetHeight)
          setActiveId(sec.id)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLink = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.getElementById(id)
    if (!target) return
    const offset = 70
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' })
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#home" className="nav-logo" onClick={(e) => handleLink(e, 'home')}>
          IEJ<span className="dot">.</span>
        </a>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {links.map((id) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeId === id ? 'active' : ''}
                onClick={(e) => handleLink(e, id)}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </a>
            </li>
          ))}
        </ul>

        <a href="/Ibrahim-El-Jichi-MyCV.pdf" className="btn btn-nav" download>
          <i className="fas fa-download" /> Resume
        </a>

        <button
          className={`menu-toggle${menuOpen ? ' open' : ''}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>
    </nav>
  )
}
