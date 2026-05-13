'use client'

import { PolicyDocument } from '@/app/types'

interface PolicySidebarProps {
  documents:  PolicyDocument[]
  auditCount: number
  isLoading:  boolean
}

function isOverdue(d: string) {
  return ['April 2026','March 2026','February 2026','January 2026'].includes(d)
}

export default function PolicySidebar({ documents, auditCount, isLoading }: PolicySidebarProps) {
  return (
    <aside className="sidebar w-80 flex-shrink-0 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="sidebar-header px-5 py-4">
        <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mb-1">
          Policy Library
        </p>
        <p className="text-white font-bold text-base leading-tight">
          {documents.length} documents loaded
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-pulse h-[88px]" />
            ))
          : documents.map((doc, i) => (
              <div key={i} className="doc-card p-3.5">
                <p className="text-[13px] font-semibold text-gray-900 leading-snug mb-1">
                  {doc.title}
                </p>
                <p className="text-[11px] font-mono text-gray-400 mb-2.5">{doc.reference}</p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="version-badge px-1.5 py-0.5 rounded text-[10px]">
                    v{doc.version}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    doc.pathway === 'Pathway 2' ? 'pathway-2' : 'pathway-1'
                  }`}>
                    {doc.pathway}
                  </span>
                  {isOverdue(doc.review_date) ? (
                    <span className="overdue-badge px-1.5 py-0.5 rounded text-[10px] font-semibold">
                      ⚠ Review due
                    </span>
                  ) : (
                    <span className="current-badge px-1.5 py-0.5 rounded text-[10px]">
                      {doc.review_date}
                    </span>
                  )}
                </div>
              </div>
            ))
        }
      </div>

      {/* Footer */}
      <div className="sidebar-footer px-5 py-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Audit Log
          </span>
          <span className="audit-count px-2.5 py-0.5 rounded-full text-[11px]">
            {auditCount} queries
          </span>
        </div>
        <p className="text-[11px] text-gray-400 leading-relaxed">
          All queries hashed for GDPR compliance. No personal data stored.
        </p>
        <div className="mt-2.5 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[11px] text-gray-500 font-medium">
            NHS compliant · local processing only
          </span>
        </div>
      </div>
    </aside>
  )
}
