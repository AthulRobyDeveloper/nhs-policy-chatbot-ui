import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title:       'UHP Policy Assistant | NHS',
  description: (
    'AI-powered policy assistant for University Hospitals ' +
    'Plymouth NHS Trust. Compliant with UHP AI Policy ' +
    'TRW.D&I.POL.1502.1.1.'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com"
              crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
