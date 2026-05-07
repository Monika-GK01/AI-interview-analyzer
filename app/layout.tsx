import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Interview Emotion Analyzer',
  description:
    'Analyze your interview performance with AI-powered insights on confidence, speaking pace, and emotional engagement.',
  keywords: [
    'interview',
    'AI',
    'emotion analysis',
    'speech analysis',
    'interview practice',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
