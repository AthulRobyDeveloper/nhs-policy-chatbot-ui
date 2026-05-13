'use client'

import { ChatMessage as ChatMessageType } from '@/app/types'
import ConfidenceBadge from './ConfidenceBadge'

interface ChatMessageProps {
  message: ChatMessageType
}

/* Render markdown-lite: **bold**, and - bullet lines */
function renderContent(text: string) {
  return text.split('\n').map((line, i) => {
    const isBullet = /^[-•]\s/.test(line)
    const parts = line.replace(/^[-•]\s/, '').split(/\*\*(.+?)\*\*/g)
    const content = parts.map((part, j) =>
      j % 2 === 1
        ? <strong key={j} className="font-semibold text-gray-900">{part}</strong>
        : part
    )
    if (isBullet) {
      return (
        <div key={i} className="flex items-start gap-2 my-0.5">
          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
          <span>{content}</span>
        </div>
      )
    }
    return line.trim() === ''
      ? <div key={i} className="h-3" />
      : <div key={i}>{content}</div>
  })
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const meta   = message.metadata

  const parseAnswer = (content: string) => {
    const lines: string[] = []
    let inSource = false
    for (const line of content.split('\n')) {
      if (line.startsWith('Source:') || line.startsWith('Reference:') ||
          line.startsWith('Page:')   || line.startsWith('Version:')   ||
          line.startsWith('⚠️')) { inSource = true }
      if (!inSource) lines.push(line)
    }
    return lines.join('\n').replace(/^Answer:\s*/i, '').trim()
  }

  if (isUser) {
    return (
      <div className="flex justify-end fade-in-up pr-1">
        <div className="user-bubble max-w-[72%] px-5 py-3 text-sm leading-relaxed font-medium">
          {message.content}
        </div>
      </div>
    )
  }

  const answerText = parseAnswer(message.content)

  return (
    <div className="flex justify-start fade-in-up">
      <div className="max-w-[88%] w-full">
        <div className="flex items-start gap-3">

          {/* Avatar — NHS logo */}
          <div className="assistant-avatar mt-0.5">
            <span className="text-[9px] font-black tracking-wider">NHS</span>
          </div>

          {/* Card */}
          <div className="flex-1 answer-card min-w-0">

            {/* Answer body */}
            <div className="px-5 py-4 text-sm text-gray-700 leading-relaxed">
              {renderContent(answerText || message.content)}
            </div>

            {/* Citation footer */}
            {meta && (
              <div className="source-footer px-5 py-3.5">

                {/* Source + pathway row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-bold text-gray-800 leading-snug truncate">
                      {meta.source}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <p className="text-[11px] font-mono text-gray-400">
                        {meta.reference} · v{meta.version} · p.{meta.page}
                      </p>
                      {meta.pdf_url && (
                        <a
                          href={`${meta.pdf_url}#page=${meta.page}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-link inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                          View p.{meta.page}
                          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                            <polyline points="15 3 21 3 21 9"/>
                            <line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap flex-shrink-0 ${
                    meta.pathway === 'Pathway 2' ? 'pathway-2' : 'pathway-1'
                  }`}>
                    {meta.pathway}
                  </span>
                </div>

                {/* Confidence */}
                <ConfidenceBadge percent={meta.confidence_percent} label={meta.confidence_label} />

                {/* Review warning */}
                {meta.answer.includes('POLICY REVIEW ALERT') && (
                  <div className="review-alert mt-3 flex items-start gap-2.5 px-3.5 py-2.5">
                    <span className="text-amber-500 flex-shrink-0 text-base leading-none mt-0.5">⚠</span>
                    <p className="text-[12px] text-amber-700 font-medium leading-snug">
                      This policy was due for review. Please verify you are reading the current version.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {meta && (
          <p className="text-[11px] text-gray-400 mt-1.5 ml-11 font-medium">
            Always verify with the original policy or your line manager.
          </p>
        )}
      </div>
    </div>
  )
}
