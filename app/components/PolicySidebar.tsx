'use client'

import { PolicyDocument } from '@/app/types'

interface PolicySidebarProps {
  documents:  PolicyDocument[]
  auditCount: number
  isLoading:  boolean
  isOpen:     boolean
  onClose:    () => void
}

function isOverdue(d: string) {
  return ['April 2026','March 2026','February 2026','January 2026'].includes(d)
}

const PDF_MAP: Record<string, string> = {
  'TRW.CRM.POL.103.5':    '/policies/data_quality.pdf',
  'TRW.D&I.POL.1502.1.1': '/policies/ai_policy.pdf',
  'TRW.HGV.POL.1467.2':   '/policies/patient_safety.pdf',
  'TRW.IGT.POL.139.7':    '/policies/info_security.pdf',
  'TRW.IGT.POL.373.6.1':  '/policies/info_governance.pdf',
}

function DocCard({ doc }: { doc: PolicyDocument }) {
  const pdfUrl = doc.pdf_url || PDF_MAP[doc.reference] || null
  const badges = (
    <div className="flex flex-wrap gap-1.5">
      <span className="version-badge">v{doc.version}</span>
      <span className={doc.pathway === 'Pathway 2' ? 'pathway-2' : 'pathway-1'}>
        {doc.pathway}
      </span>
      {isOverdue(doc.review_date)
        ? <span className="overdue-badge">⚠ Review due</span>
        : <span className="current-badge">{doc.review_date}</span>
      }
    </div>
  )

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2 mb-1.5">
        <p className="doc-card-title">{doc.title}</p>
        {pdfUrl && (
          <svg className="doc-card-icon" width="13" height="13" viewBox="0 0 24 24"
               fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
        )}
      </div>
      <p className="mono text-[10px] text-gray-400 mb-3 tracking-tight">{doc.reference}</p>
      {badges}
    </>
  )

  if (pdfUrl) {
    return (
      <a
        href={`/view?url=${encodeURIComponent(pdfUrl)}&page=1&title=${encodeURIComponent(doc.title)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="doc-card doc-card--link"
      >
        {inner}
      </a>
    )
  }

  return <div className="doc-card">{inner}</div>
}

export default function PolicySidebar({ documents, auditCount, isLoading, isOpen, onClose }: PolicySidebarProps) {
  return (
    <aside className={`sidebar flex-shrink-0 h-full overflow-hidden${isOpen ? ' open' : ''}`}>

      {/* ── Header ── */}
      <div className="sidebar-header" style={{ position: 'relative' }}>
        <div className="sidebar-drag-handle" />

        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.18em] mb-2 relative z-10">
          Policy Library
        </p>
        <div className="flex items-end justify-between relative z-10">
          <div>
            <p className="text-white font-bold text-2xl leading-none">
              {isLoading ? '—' : documents.length}
            </p>
            <p className="text-blue-200 text-[11px] mt-0.5 font-medium">documents indexed</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-[10px] font-semibold tracking-wide">LIVE</span>
            </div>
            <button onClick={onClose} className="sidebar-close-btn" aria-label="Close policy library">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Document list ── */}
      <div className="sidebar-doc-list">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-pulse" style={{ height: 96 }} />
            ))
          : documents.map((doc, i) => <DocCard key={i} doc={doc} />)
        }
      </div>

      {/* ── Footer ── */}
      <div className="sidebar-footer">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.14em]">
            Audit Log
          </span>
          <span className="audit-count">{auditCount} queries</span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed mb-3">
          All queries hashed for GDPR compliance. No personal data stored.
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
          <span className="text-[11px] text-gray-500 font-medium">
            NHS compliant · local processing only
          </span>
        </div>
      </div>
    </aside>
  )
}
