'use client'

import { ChatMessage as ChatMessageType } from '@/app/types'
import ConfidenceBadge from './ConfidenceBadge'

interface Props { message: ChatMessageType }

function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    const isBullet = /^[-•]\s/.test(line)
    const parts    = line.replace(/^[-•]\s/, '').split(/\*\*(.+?)\*\*/g)
    const nodes    = parts.map((p, j) =>
      j % 2 === 1
        ? <strong key={j} className="font-semibold text-gray-900">{p}</strong>
        : p
    )
    if (isBullet) return (
      <div key={i} className="flex items-start gap-2.5 my-1">
        <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--blue)' }} />
        <span className="flex-1">{nodes}</span>
      </div>
    )
    return line.trim() === ''
      ? <div key={i} className="h-2.5" />
      : <div key={i}>{nodes}</div>
  })
}

function parseAnswer(content: string): { body: string; note: string } {
  const bodyLines: string[] = []
  const noteLines: string[] = []
  let inMeta = false
  let inNote = false

  for (const line of content.split('\n')) {
    if (/^(Source|Reference|Page|Version):/.test(line)) { inMeta = true; inNote = false; continue }
    if (/^📄\s*Note:?/i.test(line)) { inMeta = false; inNote = true }
    if (/^⚠️/.test(line)) { inNote = false; inMeta = true; continue }

    if (inNote) {
      noteLines.push(line.replace(/^📄\s*Note:?\s*/i, ''))
    } else if (!inMeta) {
      bodyLines.push(line)
    }
  }

  return {
    body: bodyLines.join('\n').replace(/^Answer:\s*/i, '').trim(),
    note: noteLines.join('\n').trim(),
  }
}

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user'
  const meta   = message.metadata

  if (isUser) return (
    <div className="flex justify-end fade-in-up">
      <div className="user-bubble">{message.content}</div>
    </div>
  )

  const { body: answerText, note: answerNote } = parseAnswer(message.content)

  return (
    <div className="flex justify-start fade-in-up">
      <div className="w-full max-w-[92%]">
        <div className="flex items-start gap-3">

          {/* Avatar */}
          <div className="assistant-avatar">
            <span>NHS</span>
          </div>

          {/* Answer card */}
          <div className="answer-card min-w-0 flex-1">

            {/* Body */}
            <div className="answer-body">
              {renderContent(answerText || message.content)}
            </div>

            {/* Note */}
            {answerNote && (
              <div className="answer-note">
                <span className="answer-note-icon">📄</span>
                <p className="text-[12px] leading-relaxed" style={{ color: 'var(--blue)' }}>{answerNote}</p>
              </div>
            )}

            {/* Citation footer */}
            {meta && (
              <div className="source-footer">

                {/* Source row */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="min-w-0 flex-1">
                    {meta.pdf_url ? (
                      <a
                        href={`${meta.pdf_url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-title-link"
                      >
                        {meta.source}
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" strokeWidth="2.5" style={{ flexShrink: 0 }}>
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </a>
                    ) : (
                      <p className="text-[13px] font-bold text-gray-800 leading-snug mb-1">
                        {meta.source}
                      </p>
                    )}
                    <div className="flex items-center flex-wrap gap-2 mt-1">
                      <span className="mono text-[11px] text-gray-400">
                        {meta.reference} · v{meta.version}
                        {meta.all_pages?.length > 1
                          ? ` · pp.${meta.all_pages.join(', ')}`
                          : ` · p.${meta.page}`
                        }
                      </span>
                    </div>

                    {/* Page links */}
                    {meta.pdf_url && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {(meta.all_pages?.length > 1 ? meta.all_pages.slice(0, 5) : [meta.page]).map((p: number | string) => (
                          <a
                            key={p}
                            href={`/view?url=${encodeURIComponent(meta.pdf_url!)}&page=${p}&title=${encodeURIComponent(meta.source)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="pdf-link"
                          >
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" strokeWidth="2.5">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                              <polyline points="14 2 14 8 20 8"/>
                            </svg>
                            p.{p}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`font-semibold flex-shrink-0 ${
                    meta.pathway === 'Pathway 2' ? 'pathway-2' : 'pathway-1'
                  }`} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 999 }}>
                    {meta.pathway}
                  </span>
                </div>

                {/* Confidence */}
                <ConfidenceBadge percent={meta.confidence_percent} label={meta.confidence_label} />

                {/* Review alert */}
                {meta.answer.includes('POLICY REVIEW ALERT') && (
                  <div className="review-alert">
                    <span className="text-amber-500 text-base flex-shrink-0 leading-none">⚠</span>
                    <p className="text-[12px] text-amber-700 font-medium leading-snug">
                      This policy was due for review. Verify you are reading the current version.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {meta && (
          <p className="text-[11px] text-gray-400 mt-2 ml-[48px] font-medium">
            Always verify with the original policy or your line manager.
          </p>
        )}
      </div>
    </div>
  )
}
