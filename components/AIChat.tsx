'use client'
import { useState, useRef, useEffect, FormEvent } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  'What AI projects has Ibrahim built?',
  "What's his tech stack?",
  'Is he available for hire?',
  'Tell me about his experience at HAUZ',
]

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
  }, [open])

  async function send(text: string) {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      if (!res.ok || !res.body) throw new Error('Stream failed')

      // Add empty assistant message to stream into
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const payload = line.slice(6).trim()
          if (payload === '[DONE]') break
          try {
            const { delta } = JSON.parse(payload) as { delta: string }
            setMessages((prev) => {
              const copy = [...prev]
              copy[copy.length - 1] = {
                role: 'assistant',
                content: copy[copy.length - 1].content + delta,
              }
              return copy
            })
          } catch {
            // ignore parse errors on partial chunks
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't connect right now. Please try emailing Ibrahim directly at Ibrahimj02@outlook.com.",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    send(input)
  }

  const showTypingDots =
    loading &&
    (messages.length === 0 || messages[messages.length - 1].role !== 'assistant')

  return (
    <>
      {/* Floating toggle button */}
      <button
        className={`ai-toggle${open ? ' ai-toggle-open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI chat' : 'Open AI chat'}
      >
        <span className="ai-toggle-pulse" />
        <i className={`fas fa-${open ? 'times' : 'robot'}`} />
        {!open && <span className="ai-toggle-label">Ask AI</span>}
      </button>

      {/* Chat panel */}
      <div className={`ai-panel${open ? ' ai-panel-open' : ''}`} role="dialog" aria-label="AI Chat">
        {/* Header */}
        <div className="ai-panel-header">
          <div className="ai-avatar">
            <i className="fas fa-robot" />
          </div>
          <div className="ai-header-info">
            <span className="ai-header-name">Ibrahim&apos;s AI</span>
            <span className="ai-header-status">
              <span className="status-dot" />
              Online — ask me anything
            </span>
          </div>
          <button className="ai-close" onClick={() => setOpen(false)} aria-label="Close">
            <i className="fas fa-times" />
          </button>
        </div>

        {/* Messages */}
        <div className="ai-messages">
          {messages.length === 0 && (
            <div className="ai-welcome">
              <div className="ai-welcome-icon">
                <i className="fas fa-robot" />
              </div>
              <p>
                Hi! I&apos;m an AI built to represent Ibrahim. Ask me about his projects,
                experience, or skills — I&apos;ll answer instantly.
              </p>
              <div className="ai-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="ai-chip"
                    onClick={() => send(s)}
                    disabled={loading}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ai-msg-${m.role}`}>
              <div className="ai-bubble">
                {m.content || (
                  loading && i === messages.length - 1 && m.role === 'assistant' ? (
                    <span className="ai-dots">
                      <span /><span /><span />
                    </span>
                  ) : null
                )}
              </div>
            </div>
          ))}

          {showTypingDots && (
            <div className="ai-msg ai-msg-assistant">
              <div className="ai-bubble">
                <span className="ai-dots">
                  <span /><span /><span />
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form className="ai-input-form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="ai-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about Ibrahim…"
            disabled={loading}
            autoComplete="off"
          />
          <button
            type="submit"
            className="ai-send"
            disabled={loading || !input.trim()}
            aria-label="Send"
          >
            <i className="fas fa-paper-plane" />
          </button>
        </form>

        <p className="ai-disclaimer">
          <i className="fas fa-bolt" /> Powered by Gemini AI
        </p>
      </div>
    </>
  )
}
