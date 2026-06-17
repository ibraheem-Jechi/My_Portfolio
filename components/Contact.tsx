'use client'
import { useState } from 'react'

export default function Contact() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [toast, setToast]           = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const name    = (form.elements.namedItem('name')    as HTMLInputElement).value.trim()
    const email   = (form.elements.namedItem('email')   as HTMLInputElement).value.trim()
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim()

    if (!name || !email || !message) return

    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setToast(true)
      form.reset()
      setTimeout(() => { setSubmitted(false); setToast(false) }, 3500)
    }, 1200)
  }

  return (
    <>
      <section className="section contact-section" id="contact">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Get In Touch</span>
            <h2 className="section-title">Let&apos;s Work Together</h2>
            <p className="section-sub">
              Open to full-time, freelance, and contract opportunities. Let&apos;s build something great.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info reveal">
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-envelope" /></div>
                <div>
                  <span className="ci-label">Email</span>
                  <a href="mailto:Ibrahimj02@outlook.com" className="ci-value">
                    Ibrahimj02@outlook.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-phone" /></div>
                <div>
                  <span className="ci-label">Phone</span>
                  <a href="tel:+96178860266" className="ci-value">+961 78 860 266</a>
                </div>
              </div>
              <div className="contact-item">
                <div className="ci-icon"><i className="fas fa-map-marker-alt" /></div>
                <div>
                  <span className="ci-label">Location</span>
                  <span className="ci-value">Lebanon — Remote-first</span>
                </div>
              </div>
              <div className="contact-socials">
                <a href="https://github.com/ibraheem-Jechi" className="csocial github" target="_blank" rel="noopener">
                  <i className="fab fa-github" /> GitHub
                </a>
                <a href="https://www.linkedin.com/in/ibrahim-el-jichi/" className="csocial linkedin" target="_blank" rel="noopener">
                  <i className="fab fa-linkedin" /> LinkedIn
                </a>
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input type="text" id="name" name="name" placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" name="email" placeholder="your@email.com" required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="What&apos;s this about?" />
              </div>
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows={5} placeholder="Tell me about your project..." required />
              </div>
              <button
                type="submit"
                className="btn btn-primary btn-full"
                disabled={submitting || submitted}
                style={submitted ? { background: 'linear-gradient(135deg,#22c55e,#16a34a)' } : undefined}
              >
                {submitting ? (
                  <><i className="fas fa-spinner fa-spin" /> Sending...</>
                ) : submitted ? (
                  <><i className="fas fa-check" /> Message Sent!</>
                ) : (
                  <><i className="fas fa-paper-plane" /> Send Message</>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Toast */}
      <div className={`toast${toast ? ' show' : ''}`}>
        <i className="fas fa-check-circle" />
        <span>Your message was sent. I&apos;ll be in touch soon!</span>
      </div>
    </>
  )
}
