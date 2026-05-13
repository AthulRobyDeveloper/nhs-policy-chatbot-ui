'use client'

import { ChatMessage as ChatMessageType } from '@/types'
import ConfidenceBadge from './ConfidenceBadge'

interface ChatMessageProps {
  message: ChatMessageType
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'
  const meta   = message.metadata

  // Parse answer from response
  // LLM returns "Answer: [text]\n\nSource: ..."
  // We split on Source: to get clean answer
  const parseAnswer = (content: string) => {
    const lines = content.split('\n')
    const answerLines: string[] = []
    const sourceMeta:  string[] = []
    let inSource = false

    for (const line of lines) {
      if (line.startsWith('Source:') ||
          line.startsWith('Reference:') ||
          line.startsWith('Page:') ||
          line.startsWith('Version:') ||
          line.startsWith('⚠️')) {
        inSource = true
      }
      if (inSource) {
        sourceMeta.push(line)
      } else {
        answerLines.push(line)
      }
    }

    return {
      answerText: answerLines.join('\n').replace(/^Answer:\s*/i, '').trim(),
      sourceText: sourceMeta
    }
  }

  if (isUser) {
    return (
      <div className="flex justify-end fade-in-up">
        <div className="
          max-w-lg px-4 py-3 rounded-2xl
          rounded-tr-sm text-white text-sm
          shadow-sm
        " style={{ backgroundColor: 'var(--nhs-blue)' }}>
          {message.content}
        </div>
      </div>
    )
  }

  const { answerText } = parseAnswer(message.content)

  return (
    <div className="flex justify-start fade-in-up">
      <div className="max-w-2xl w-full">

        {/* Answer card */}
        <div className="
          bg-white rounded-2xl rounded-tl-sm
          border border-gray-100 shadow-sm
          overflow-hidden
        ">
          {/* Answer text */}
          <div className="p-4">
            <div className="
              text-sm text-gray-800 leading-relaxed
              whitespace-pre-wrap
            ">
              {answerText || message.content}
            </div>
          </div>

          {/* Source citation bar */}
          {meta && (
            <div className="
              px-4 py-3 border-t border-gray-100
              bg-gray-50
            ">
              <div className="flex flex-wrap items-start gap-2">

                {/* Source */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900">
                    {meta.source}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {meta.reference} · v{meta.version} · p{meta.page}
                  </p>
                </div>

                {/* Pathway badge */}
                <span className={`
                  px-2 py-0.5 rounded-full text-xs font-medium
                  flex-shrink-0
                  ${meta.pathway === 'Pathway 2'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-blue-100 text-blue-800'}
                `}>
                  {meta.pathway}
                </span>

              </div>

              {/* Confidence */}
              <div className="mt-2">
                <ConfidenceBadge
                  percent={meta.confidence_percent}
                  label={meta.confidence_label}
                />
              </div>

              {/* Review warning */}
              {meta.answer.includes('POLICY REVIEW ALERT') && (
                <div className="
                  mt-2 flex items-start gap-2
                  px-3 py-2 rounded-lg
                  bg-amber-50 border border-amber-200
                ">
                  <span className="text-amber-600 text-sm">⚠️</span>
                  <p className="text-xs text-amber-800">
                    This policy was due for review in April 2026.
                    Please verify you are reading the current version.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Disclaimer */}
        {meta && (
          <p className="text-xs text-gray-400 mt-1.5 px-1">
            Always verify with original policy or your line manager.
          </p>
        )}

      </div>
    </div>
  )
}
