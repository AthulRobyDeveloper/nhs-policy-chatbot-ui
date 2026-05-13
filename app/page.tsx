'use client'

import { useState, useEffect, useRef } from 'react'
import PolicySidebar from '@/app/components/PolicySidebar'
import ChatMessageComponent from '@/app/components/ChatMessage'
import { ChatMessage, PolicyDocument, PolicyResponse } from '@/app/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const SUGGESTED_QUESTIONS = [
  "What is UHP's policy on using ChatGPT?",
  "Who must approve AI systems at UHP?",
  "What is the process for reporting a patient safety incident?",
  "What does DCB0129 require?",
  "What are the data quality standards at UHP?",
]

export default function Home() {
  const [messages,    setMessages]    = useState<ChatMessage[]>([])
  const [input,       setInput]       = useState('')
  const [isLoading,   setIsLoading]   = useState(false)
  const [documents,   setDocuments]   = useState<PolicyDocument[]>([])
  const [docsLoading, setDocsLoading] = useState(true)
  const [auditCount,  setAuditCount]  = useState(0)
  const [error,       setError]       = useState<string | null>(null)

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

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(), role: 'user',
      content: question.trim(), timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, userMessage])
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
      setAuditCount(prev => prev + 1)
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

  return (
    <div className="app-shell flex flex-col h-screen overflow-hidden">

      {/* ── Header ── */}
      <header className="app-header flex-shrink-0">
        <div className="max-w-screen-2xl mx-auto px-6 py-3.5 flex items-center justify-between relative z-10">

          {/* Brand */}
          <div className="flex items-center gap-4">
            <div className="nhs-logo-badge">NHS</div>
            <div>
              <h1 className="text-white font-bold text-[15px] leading-tight tracking-tight">
                UHP Policy Assistant
              </h1>
              <p className="text-blue-200 text-[11px] tracking-wide font-medium">
                University Hospitals Plymouth NHS Trust
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="hidden sm:flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-blue-100 text-xs font-semibold tracking-wider">LIVE</span>
            </div>

            {/* Compliance */}
            <div className="compliance-chip flex items-center gap-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2.5" className="text-blue-200">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="text-blue-100 text-xs font-medium">
                Pathway 1 · TRW.D&I.POL.1502.1.1
              </span>
            </div>
          </div>
        </div>
        <div className="header-glow" />
      </header>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">
        <PolicySidebar documents={documents} auditCount={auditCount} isLoading={docsLoading} />

        <main className="chat-main flex-1 flex flex-col overflow-hidden">

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto px-6 py-8">

            {/* Welcome */}
            {messages.length === 0 && (
              <div className="max-w-2xl mx-auto fade-in-up">

                {/* Hero */}
                <div className="hero-card p-8 text-center mb-5">
                  <div className="hero-icon w-16 h-16 mx-auto mb-5 flex items-center justify-center text-3xl">
                    🏥
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">
                    UHP Policy Assistant
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto mb-5">
                    Ask questions about UHP policies and procedures. Every answer
                    is grounded in official documents with full source citations.
                  </p>
                  <div className="warning-chip inline-flex items-center gap-2 px-4 py-2 text-xs font-medium">
                    <span>⚠</span>
                    Do not include patient or staff personal data in your questions
                  </div>
                </div>

                {/* Suggested */}
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                  Try asking
                </p>
                <div className="space-y-2">
                  {SUGGESTED_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="suggest-btn w-full text-left px-4 py-3.5 flex items-center gap-3 group"
                    >
                      <span className="suggest-arrow">→</span>
                      <span className="text-sm font-medium">{q}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="max-w-2xl mx-auto w-full space-y-5">
              {messages.map(msg => (
                <ChatMessageComponent key={msg.id} message={msg} />
              ))}

              {/* Typing */}
              {isLoading && (
                <div className="flex justify-start fade-in-up">
                  <div className="flex items-start gap-3">
                    <div className="assistant-avatar"><span className="text-[9px] font-black tracking-wider">NHS</span></div>
                    <div className="answer-card px-5 py-4 flex items-center gap-3">
                      <div className="flex gap-1.5">
                        {[0,1,2].map(i => (
                          <div key={i}
                            className="w-2 h-2 rounded-full animate-bounce"
                            style={{ background: 'var(--blue)', animationDelay: `${i*0.15}s` }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400 font-medium">Searching policy documents…</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="error-card flex items-start gap-3 px-5 py-4 fade-in-up">
                  <span className="text-red-500 text-base mt-0.5">⚠</span>
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* ── Input ── */}
          <div className="input-area flex-shrink-0 px-6 py-4">
            <div className="max-w-2xl mx-auto">
              <div className="input-box flex gap-3 items-end p-3">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a policy question… (e.g. What is UHP's policy on AI?)"
                  rows={1}
                  className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 focus:outline-none px-2 py-1 max-h-32 overflow-y-auto"
                  style={{ minHeight: '36px', lineHeight: '1.6' }}
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isLoading}
                  className="send-btn flex-shrink-0 w-9 h-9 flex items-center justify-center text-white font-bold text-base disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none"
                >
                  ↑
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-2 text-center font-medium">
                All queries are anonymously logged for audit compliance · Do not include patient data
              </p>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
