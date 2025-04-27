import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: 'Listeando | Create CSV Lists using AI agents',
  description: 'Create lists effortlessly with the help of AI agents.',
  generator: 'Next.js',
  applicationName: 'Listeando',
  keywords: 'AI, lists, productivity, agents'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
