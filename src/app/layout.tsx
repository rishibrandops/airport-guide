import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Airport Guide — International Airport Directory',
  description: 'Search and explore airports worldwide. Find flights, transport, weather, parking, lounges and more.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <header className="border-b bg-background sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
              <span className="text-2xl">✈</span>
              <span>Airport Guide</span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/airports" className="text-muted-foreground hover:text-foreground transition-colors">
                All Airports
              </Link>
              <Link href="/airports?continent=Europe" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Europe
              </Link>
              <Link href="/airports?continent=Asia" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Asia
              </Link>
              <Link href="/airports?continent=North%20America" className="text-muted-foreground hover:text-foreground transition-colors hidden sm:block">
                Americas
              </Link>
            </nav>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 font-semibold">
                <span className="text-xl">✈</span>
                <span>Airport Guide</span>
              </div>
              <p className="text-sm text-muted-foreground">
                International airport directory — flight info, transport, weather & more.
              </p>
            </div>
            <Separator className="my-6" />
            <p className="text-xs text-muted-foreground text-center">
              Flight data refreshed daily. Airport information refreshed monthly.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
