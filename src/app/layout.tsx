import type {Metadata} from 'next';
import { Inter, Montserrat, Great_Vibes } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const greatVibes = Great_Vibes({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-script',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://satyaraj.portfolio'),
  title: {
    default: 'Satya Raj',
    template: '%s | Satya Raj'
  },
  icons: {
    icon: '/satya-logo.png',
    apple: '/satya-logo.png',
  },
  description: 'Professional portfolio of Satya Raj, a video editor and content editor creating cinematic edits, reels, shorts, motion graphics, and visual stories.',
  keywords: ['Video Editor', 'Content Editor', 'Portfolio', 'Satya Raj', 'Reels Editor', 'Shorts Editor', 'Motion Graphics', 'Color Grading'],
  authors: [{ name: 'Satya Raj' }],
  creator: 'Satya Raj',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://satyaraj.portfolio',
    title: 'Satya Raj | Video Editor & Content Editor Portfolio',
    description: 'Explore cinematic edits, reels, shorts, color grading, motion graphics, and visual projects by Satya Raj.',
    siteName: 'Satya Raj Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Satya Raj Portfolio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Satya Raj | Video Editor & Content Editor',
    description: 'Creating cinematic edits, reels, shorts, color grading, and motion graphics.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${montserrat.variable} ${greatVibes.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
