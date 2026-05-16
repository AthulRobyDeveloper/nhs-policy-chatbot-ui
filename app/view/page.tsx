'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function PDFRedirect() {
  const params = useSearchParams()
  const url    = params.get('url')  || ''
  const page   = params.get('page') || '1'
  const title  = params.get('title') || 'Policy Document'

  useEffect(() => {
    if (!url) return
    // Strip any existing fragment, add cache-buster, then add #page=N.
    const base   = url.split('#')[0]
    const sep    = base.includes('?') ? '&' : '?'
    const target = `${base}${sep}_t=${Date.now()}#page=${page}`
    window.location.href = target
  }, [url, page])

  if (!url) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#0d1f3c', color: '#fff', fontFamily: 'system-ui' }}>
        <p>No document URL provided.</p>
      </div>
    )
  }

  const base2       = url.split('#')[0]
  const fallbackUrl = `${base2}${base2.includes('?') ? '&' : '?'}_t=${Date.now()}#page=${page}`

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100dvh',
      background: 'linear-gradient(135deg,#00254d,#005EB8)',
      fontFamily: 'system-ui', gap: 16,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(255,255,255,0.2)',
        borderTopColor: '#fff',
        animation: 'spin 0.7s linear infinite',
      }} />
      <p style={{ color: '#fff', fontWeight: 700, fontSize: 15, margin: 0 }}>{title}</p>
      <p style={{ color: '#93c5fd', fontSize: 13, margin: 0 }}>Opening page {page}…</p>
      <a href={fallbackUrl} style={{ marginTop: 8, color: '#bfdbfe', fontSize: 12, textDecoration: 'underline' }}>
        Click here if not redirected
      </a>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100dvh', background: '#00254d', color: '#fff' }}>
        Loading…
      </div>
    }>
      <PDFRedirect />
    </Suspense>
  )
}
