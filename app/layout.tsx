import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AppLayout from '../components/AppLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Assistant',
  description: 'Your personal AI assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} font-sans`}>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  )
}
