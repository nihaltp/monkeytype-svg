import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import './globals.css'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Monkeytype Streak',
  description: 'Generate a dynamic GitHub README widget for your Monkeytype stats.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_VERCEL_URL ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}` : 'http://localhost:3000'),
  keywords: ['monkeytype', 'typing test', 'streak', 'github readme', 'widget', 'svg', 'typing stats'],
  authors: [{ name: 'nihaltp', url: 'https://github.com/nihaltp' }],
  creator: 'nihaltp',
  openGraph: {
    title: 'Monkeytype Streak',
    description: 'Show off your typing discipline on GitHub with a dynamic streak widget.',
    url: '/',
    siteName: 'Monkeytype Streak',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Monkeytype Streak',
    description: 'Generate a dynamic GitHub README widget for your Monkeytype stats.',
    creator: '@nihaltp',
  },
  verification: {
    google: 'google-site-verification-code', // Placeholder, user should replace or configure via env
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Monkeytype Streak',
    description: 'Generate a dynamic GitHub README widget for your Monkeytype stats.',
    applicationCategory: 'DeveloperApplication',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'nihaltp',
      url: 'https://github.com/nihaltp',
    },
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
