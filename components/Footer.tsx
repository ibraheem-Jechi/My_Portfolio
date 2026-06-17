export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <a href="#home" className="nav-logo">
            IEJ<span className="dot">.</span>
          </a>
          <p className="footer-copy">
            Designed &amp; built by <strong>Ibrahim El Jichi</strong> · 2026
          </p>
          <nav className="footer-nav">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
