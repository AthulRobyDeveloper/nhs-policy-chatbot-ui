'use client'

import { useState, useEffect, useRef } from 'react'
import PolicySidebar from '@/app/components/PolicySidebar'
import ChatMessageComponent from '@/app/components/ChatMessage'
import { ChatMessage, PolicyDocument, PolicyResponse } from '@/app/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SUGGESTED_QUESTIONS = [
  { icon: '🤖', text: "What is UHP's policy on using ChatGPT?" },
  { icon: '✅', text: 'Who must approve AI systems at UHP?' },
  { icon: '🚨', text: 'What is the process for reporting a patient safety incident?' },
  { icon: '📋', text: 'What does DCB0129 require?' },
  { icon: '📊', text: 'What are the data quality standards at UHP?' },
]

export default function Home() {
  const [messages,    setMessages]    = useState<ChatMessage[]>([])
  const [input,       setInput]       = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [documents,   setDocuments]   = useState<PolicyDocument[]>([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [auditCount,  setAuditCount]  = useState(0)
  const [error,       setError]       = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    fetch(`${API_URL}/policies`)
      .then(r => r.json())
      .then(data => { setDocuments(data.documents || []); setDocsLoading(false) })
      .catch(() => setDocsLoading(false))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const sendMessage = async (question: string) => {
    if (!question.trim() || isLoading) return
    setError(null)
    setMessages(prev => [...prev, {
      id: crypto.randomUUID(), role: 'user',
      content: question.trim(), timestamp: new Date().toISOString()
    }])
    setInput('')
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim() })
      })
      if (!res.ok) { const e = await res.json(); throw new Error(e.detail || 'Request failed') }
      const data: PolicyResponse = await res.json()
      setMessages(prev => [...prev, {
        id: crypto.randomUUID(), role: 'assistant',
        content: data.answer, timestamp: data.timestamp, metadata: data
      }])
      setAuditCount(c => c + 1)
    } catch (err: any) {
      setError(err.message || 'Failed to get response')
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }

  const newChat = () => {
    setMessages([]); setInput(''); setError(null); setAuditCount(0)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden" style={{ background: 'var(--surface)' }}>

      {/* ══ HEADER ══ */}
      <header className="app-header">
        <div className="header-inner">

          {/* Logo + title */}
          <div className="flex items-center gap-6">
            <img src="/nhs-uhp-logo.png" alt="University Hospitals Plymouth NHS Trust"
                 className="uhp-logo-img" />
            <div className="header-divider header-divider--desktop" />
            <div className="header-title-block">
              <p className="text-white font-bold text-[17px] leading-none tracking-tight">
                Policy Assistant
              </p>
              <p className="text-blue-200 text-[12px] font-medium mt-1.5 tracking-wide">
                AI-powered · Pathway 1 compliant
              </p>
            </div>
          </div>

          {/* Right actions */}
          <div className="header-actions">
            {/* Mobile only: open policy drawer */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="mobile-policy-btn"
              aria-label="View policy library"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Policies
            </button>

            {/* Desktop only: compliance chip */}
            <div className="compliance-chip compliance-chip--desktop">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" className="text-blue-200">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="text-blue-100 text-[12px] font-semibold tracking-wide">
                TRW.D&I.POL.1502.1.1
              </span>
            </div>

            {/* New Chat — shown when conversation active */}
            {messages.length > 0 && (
              <button onClick={newChat} className="new-chat-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14"/>
                </svg>
                <span>New Chat</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="flex flex-1 overflow-hidden">

        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="sidebar-backdrop"
            style={{ display: 'block' }}
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <PolicySidebar
          documents={documents}
          auditCount={auditCount}
          isLoading={docsLoading}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="chat-main flex-1 flex flex-col overflow-hidden">

          {/* ── Scroll area ── */}
          <div className="chat-scroll flex-1 overflow-y-auto px-6 py-8">

            {/* ── WELCOME SCREEN ── */}
            {messages.length === 0 && (
              <div className="welcome-wrap fade-in-up">

                {/* Hero card */}
                <div className="hero-card mb-8">
                  {/* Top row — icon left, text right */}
                  <div className="hero-top">
                    <div className="hero-icon-wrap">🏥</div>
                    <div className="hero-text">
                      <h2 className="hero-title">UHP Policy Assistant</h2>
                      <p className="hero-sub">
                        Instant, cited answers from official UHP policy documents.
                        Ask anything — every answer is grounded in the source with full citations.
                      </p>
                      <div className="warning-chip">
                        <span>⚠</span>
                        Do not include patient or staff personal data in your questions
                      </div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="hero-stats">
                    <div className="hero-stat">
                      <div className="hero-stat-num">{docsLoading ? '—' : documents.length}</div>
                      <div className="hero-stat-label">Policy Documents</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">RAG</div>
                      <div className="hero-stat-label">AI Architecture</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">P1</div>
                      <div className="hero-stat-label">Pathway Compliant</div>
                    </div>
                    <div className="hero-stat">
                      <div className="hero-stat-num">100%</div>
                      <div className="hero-stat-label">Local Processing</div>
                    </div>
                  </div>
                </div>

                {/* Suggested questions */}
                <p className="suggest-section-label">Try asking</p>
                <div className="suggest-grid">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button key={i} onClick={() => sendMessage(q.text)} className="suggest-btn">
                      <div className="suggest-icon">{q.icon}</div>
                      <div className="suggest-text">
                        <span className="suggest-question">{q.text}</span>
                        <span className="suggest-hint">Tap to ask →</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── MESSAGE THREAD ── */}
            <div className="w-full mx-auto flex flex-col gap-6" style={{ maxWidth: 900 }}>
              {messages.map(msg => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}

              {/* Typing */}
              {isLoading && (
                <div className="flex justify-start fade-in-up">
                  <div className="flex items-start gap-3">
                    <div className="assistant-avatar"><span>NHS</span></div>
                    <div className="answer-card px-6 py-4 flex items-center gap-4">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <div key={i} className="w-2.5 h-2.5 rounded-full animate-bounce"
                               style={{ background: 'var(--blue)', animationDelay: `${i*0.18}s` }} />
                        ))}
                      </div>
                      <span className="text-[13px] font-medium" style={{ color: 'var(--ink-4)' }}>
                        Searching policy documents…
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="error-card fade-in-up">
                  <span className="text-red-500 text-lg flex-shrink-0">⚠</span>
                  <p className="text-[13px] font-medium text-red-600">{error}</p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── INPUT BAR ── */}
          <div className="input-area">
            <div style={{ maxWidth: 900, margin: '0 auto', width: '100%' }}>
              <div className="input-box">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a policy question…"
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-[14px] placeholder-gray-400 focus:outline-none py-1.5 max-h-32 overflow-y-auto"
                  style={{ minHeight: 36, lineHeight: 1.65, color: 'var(--ink-1)' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="send-btn disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  ↑
                </button>
              </div>
              <p className="text-[11px] text-center font-medium mt-2.5" style={{ color: 'var(--ink-4)' }}>
                All queries are anonymously logged for audit compliance · Do not include patient data
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
