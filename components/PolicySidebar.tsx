'use client'

import { PolicyDocument } from '@/types'

interface PolicySidebarProps {
  documents:   PolicyDocument[]
  auditCount:  number
  isLoading:   boolean
}

function isOverdue(reviewDate: string): boolean {
  const overdueList = ['April 2026', 'March 2026',
                       'February 2026', 'January 2026']
  return overdueList.includes(reviewDate)
}

function pathwayColour(pathway: string): string {
  return pathway === 'Pathway 2'
    ? 'bg-orange-100 text-orange-800'
    : 'bg-blue-100 text-blue-800'
}

export default function PolicySidebar({
  documents,
  auditCount,
  isLoading
}: PolicySidebarProps) {
  return (
    <aside className="
      w-72 flex-shrink-0 bg-white border-r
      border-gray-200 flex flex-col h-full
    ">
      {/* Header */}
      <div className="p-4 border-b border-gray-200"
           style={{ backgroundColor: 'var(--nhs-blue)' }}>
        <h2 className="text-white font-semibold text-sm uppercase
                       tracking-wider">
          Policy Library
        </h2>
        <p className="text-blue-200 text-xs mt-0.5">
          {documents.length} documents loaded
        </p>
      </div>

      {/* Documents list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="
              h-20 rounded-lg pulse-nhs
            "/>
          ))
        ) : (
          documents.map((doc, i) => (
            <div key={i} className="
              rounded-lg border border-gray-100
              p-3 bg-gray-50 hover:bg-blue-50
              hover:border-blue-200 transition-colors
              cursor-default
            ">
              {/* Title */}
              <p className="text-xs font-semibold text-gray-900
                            leading-tight mb-1">
                {doc.title}
              </p>

              {/* Reference */}
              <p className="text-xs text-gray-500 font-mono mb-2">
                {doc.reference}
              </p>

              {/* Badges row */}
              <div className="flex flex-wrap gap-1">
                {/* Version */}
                <span className="
                  px-1.5 py-0.5 rounded text-xs
                  bg-gray-200 text-gray-700 font-medium
                ">
                  v{doc.version}
                </span>

                {/* Pathway */}
                <span className={`
                  px-1.5 py-0.5 rounded text-xs font-medium
                  ${pathwayColour(doc.pathway)}
                `}>
                  {doc.pathway}
                </span>

                {/* Review date warning */}
                {isOverdue(doc.review_date) ? (
                  <span className="
                    px-1.5 py-0.5 rounded text-xs font-medium
                    bg-red-100 text-red-700 flex items-center gap-1
                  ">
                    ⚠️ Review due
                  </span>
                ) : (
                  <span className="
                    px-1.5 py-0.5 rounded text-xs
                    bg-green-100 text-green-700
                  ">
                    Review {doc.review_date}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Audit stats footer */}
      <div className="
        p-4 border-t border-gray-200
        bg-gray-50
      ">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-gray-600
                           uppercase tracking-wider">
            Audit Log
          </span>
          <span className="
            px-2 py-0.5 rounded-full text-xs font-medium
            bg-blue-100 text-blue-800
          ">
            {auditCount} queries
          </span>
        </div>
        <p className="text-xs text-gray-500">
          All queries hashed for GDPR compliance.
          No personal data stored.
        </p>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-500"/>
          <span className="text-xs text-gray-600">
            NHS compliant — local processing only
          </span>
        </div>
      </div>
    </aside>
  )
}
