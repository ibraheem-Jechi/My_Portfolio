'use client'
import { useState, useEffect, useRef } from 'react'

interface MatchResult {
  score: number
  matchingSkills: string[]
  relevantProjects: string[]
  pitch: string
}

export default function AIJobMatch() {
  const [open, setOpen] = useState(false)
  const [jobDesc, setJobDesc] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [animScore, setAnimScore] = useState(0)
  const [visibleSkills, setVisibleSkills] = useState(0)
  const [typedPitch, setTypedPitch] = useState('')
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([])

  function clearAllTimers() {
    timersRef.current.forEach(t => clearInterval(t))
    timersRef.current = []
  }

  useEffect(() => {
    if (!result) return
    clearAllTimers()
    setAnimScore(0)
    setVisibleSkills(0)
    setTypedPitch('')

    const startTime = Date.now()
    const duration = 1200
    const target = result.score

    const scoreTimer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setAnimScore(Math.floor(eased * target))

      if (progress >= 1) {
        clearInterval(scoreTimer)
        setAnimScore(target)

        let idx = 0
        const skillTimer = setInterval(() => {
          idx++
          setVisibleSkills(idx)
          if (idx >= result.matchingSkills.length) {
            clearInterval(skillTimer)
            const delayId = setTimeout(() => {
              let c = 0
              const typeTimer = setInterval(() => {
                c++
                setTypedPitch(result.pitch.slice(0, c))
                if (c >= result.pitch.length) clearInterval(typeTimer)
              }, 14)
              timersRef.current.push(typeTimer)
            }, 250) as unknown as ReturnType<typeof setInterval>
            timersRef.current.push(delayId)
          }
        }, 150)
        timersRef.current.push(skillTimer)
      }
    }, 16)
    timersRef.current.push(scoreTimer)

    return () => clearAllTimers()
  }, [result])

  async function analyze() {
    if (!jobDesc.trim() || loading) return
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDescription: jobDesc }),
      })
      if (!res.ok) throw new Error('API error')
      const data: MatchResult = await res.json()
      setResult(data)
    } catch {
      setResult({
        score: 0,
        matchingSkills: [],
        relevantProjects: [],
        pitch: 'Analysis could not be completed. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    clearAllTimers()
    setResult(null)
    setJobDesc('')
    setAnimScore(0)
    setVisibleSkills(0)
    setTypedPitch('')
  }

  function close() {
    setOpen(false)
    reset()
  }

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (animScore / 100) * circumference
  const scoreColor =
    animScore >= 80 ? '#10b981' : animScore >= 60 ? '#f59e0b' : animScore > 0 ? '#ef4444' : 'rgba(255,255,255,0.08)'
  const scoreGlow =
    animScore >= 80 ? 'rgba(16,185,129,0.35)' : animScore >= 60 ? 'rgba(245,158,11,0.35)' : 'rgba(239,68,68,0.35)'
  const verdict =
    animScore >= 80 ? 'Strong Fit' : animScore >= 60 ? 'Good Fit' : animScore >= 40 ? 'Partial Fit' : 'Low Match'

  return (
    <>
      <button
        className={`jm-toggle${open ? ' jm-toggle-open' : ''}`}
        onClick={() => (open ? close() : setOpen(true))}
        aria-label="Open AI Job Match Analyzer"
      >
        <span className="jm-pulse" />
        <i className="fas fa-chart-line" />
        <span className="jm-toggle-label">Match Score</span>
      </button>

      <div className={`jm-overlay${open ? ' jm-overlay-open' : ''}`} onClick={close}>
        <div className="jm-modal" onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className="jm-header">
            <div className="jm-header-left">
              <div className="jm-header-icon">
                <i className="fas fa-brain" />
              </div>
              <div>
                <div className="jm-header-title">AI Job Match</div>
                <div className="jm-header-sub">Gemini-powered · Instant analysis</div>
              </div>
            </div>
            <button className="jm-close" onClick={close} aria-label="Close">
              <i className="fas fa-times" />
            </button>
          </div>

          {/* Input state */}
          {!result && !loading && (
            <div className="jm-body jm-input-state">
              <div className="jm-intro">
                <span className="jm-intro-tag">RECRUITER TOOL</span>
                <p>Paste a job description and the AI will score how well Ibrahim fits — including matching skills, relevant projects, and a personalized pitch.</p>
              </div>
              <div className="jm-textarea-wrap">
                <textarea
                  className="jm-textarea"
                  value={jobDesc}
                  onChange={e => setJobDesc(e.target.value)}
                  placeholder="We're looking for a Full-Stack Engineer with 3+ years of experience in React, Node.js, and cloud infrastructure…"
                  rows={5}
                />
                <div className="jm-char-hint">{jobDesc.length > 0 ? `${jobDesc.length} chars` : 'paste or type'}</div>
              </div>
              <button className="jm-analyze-btn" onClick={analyze} disabled={!jobDesc.trim()}>
                <i className="fas fa-bolt" />
                <span>Analyze Match</span>
                <div className="jm-btn-shine" />
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="jm-body jm-loading-state">
              <div className="jm-neural">
                <div className="jm-n n1" /><div className="jm-n n2" /><div className="jm-n n3" />
                <div className="jm-n n4" /><div className="jm-n n5" />
                <svg className="jm-n-lines" viewBox="0 0 120 120" fill="none">
                  <line x1="20" y1="20" x2="60" y2="60" stroke="currentColor" strokeWidth="1" className="nl nl1"/>
                  <line x1="100" y1="20" x2="60" y2="60" stroke="currentColor" strokeWidth="1" className="nl nl2"/>
                  <line x1="20" y1="100" x2="60" y2="60" stroke="currentColor" strokeWidth="1" className="nl nl3"/>
                  <line x1="100" y1="100" x2="60" y2="60" stroke="currentColor" strokeWidth="1" className="nl nl4"/>
                  <line x1="20" y1="20" x2="100" y2="20" stroke="currentColor" strokeWidth="1" className="nl nl5"/>
                  <line x1="20" y1="100" x2="100" y2="100" stroke="currentColor" strokeWidth="1" className="nl nl5"/>
                </svg>
              </div>
              <p className="jm-loading-label">Analyzing job requirements</p>
              <div className="jm-loading-dots"><span /><span /><span /></div>
            </div>
          )}

          {/* Results state */}
          {result && !loading && (
            <div className="jm-body jm-results-state">
              {/* Score ring */}
              <div className="jm-score-block">
                <div className="jm-ring-wrap" style={{ '--sg': scoreGlow } as React.CSSProperties}>
                  <svg width="148" height="148" viewBox="0 0 148 148" className="jm-ring-svg">
                    <circle cx="74" cy="74" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
                    <circle
                      cx="74" cy="74" r={radius}
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      transform="rotate(-90 74 74)"
                      style={{ transition: 'stroke-dashoffset 0.04s linear, stroke 0.4s ease' }}
                    />
                  </svg>
                  <div className="jm-ring-inner">
                    <span className="jm-score-num" style={{ color: scoreColor }}>{animScore}</span>
                    <span className="jm-score-pct" style={{ color: scoreColor }}>%</span>
                    <span className="jm-score-word">match</span>
                  </div>
                </div>
                {animScore > 0 && (
                  <div className="jm-verdict" style={{ color: scoreColor }}>
                    {verdict}
                  </div>
                )}
              </div>

              {/* Matching skills */}
              {result.matchingSkills.length > 0 && (
                <div className="jm-section">
                  <div className="jm-section-title">
                    <i className="fas fa-check-circle" /> Matching Skills
                  </div>
                  <div className="jm-chips">
                    {result.matchingSkills.slice(0, visibleSkills).map((s, i) => (
                      <span key={i} className="jm-chip jm-chip-skill">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Relevant projects */}
              {result.relevantProjects.length > 0 && visibleSkills >= result.matchingSkills.length && (
                <div className="jm-section">
                  <div className="jm-section-title">
                    <i className="fas fa-folder-open" /> Relevant Projects
                  </div>
                  <div className="jm-chips">
                    {result.relevantProjects.map((p, i) => (
                      <span key={i} className="jm-chip jm-chip-project">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI pitch */}
              {typedPitch && (
                <div className="jm-pitch">
                  <i className="fas fa-quote-left jm-pitch-icon" />
                  <p className="jm-pitch-text">
                    {typedPitch}
                    {typedPitch.length < (result?.pitch?.length ?? 0) && (
                      <span className="jm-cursor" />
                    )}
                  </p>
                </div>
              )}

              <button className="jm-retry-btn" onClick={reset}>
                <i className="fas fa-redo" /> Try Another Job
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
