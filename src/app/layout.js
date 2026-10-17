import './globals.css'
import { Bodoni_Moda, Cormorant_Garamond, IBM_Plex_Sans, Jost, Manrope, Outfit } from 'next/font/google'
import { AuthProvider } from '@/lib/auth-context'
import { ToastProvider } from '@/components/ui/toast'
import { siteUrl } from '@/lib/seo/site'

// Defaults only. Public pages set their own title, description, canonical and Open Graph via
// modules/public-site/services/seo.js; private areas are noindexed by header (next.config.mjs).
export const metadata = {
  title: { default: 'The Salon & Glam Studio', template: '%s | The Salon' },
  description: 'The Salon & Glam Studio in Birendranagar-8, Surkhet. Haircuts, colour, makeup, bridal styling and grooming for men and women.',
  applicationName: 'The Salon',
  metadataBase: new URL(siteUrl()),
  openGraph: {
    type: 'website',
    siteName: 'The Salon & Glam Studio',
    locale: 'en_US',
    images: ['/img/og.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [{ url: '/img/logo.png', type: 'image/png' }],
    apple: '/img/apple-icon.png',
  },
}

// Self-hosted at build time (no render-blocking Google Fonts request). Public-site fonts are
// preloaded; dashboard fonts are declared but only downloaded on screens that use them.
const outfit = Outfit({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'], variable: '--font-outfit', display: 'swap' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'], variable: '--font-cormorant', display: 'swap' })
const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-manrope', display: 'swap', preload: false })
const bodoni = Bodoni_Moda({ subsets: ['latin'], weight: ['400', '500'], style: ['normal', 'italic'], variable: '--font-bodoni', display: 'swap' })
const jost = Jost({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-jost-face', display: 'swap' })
const plex = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-plex', display: 'swap', preload: false })

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${cormorant.variable} ${manrope.variable} ${plex.variable} ${bodoni.variable} ${jost.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'light';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (error) {
                document.documentElement.classList.remove('dark');
              }
            })();
          `
        }} />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
