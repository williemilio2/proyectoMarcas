import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Aulas - Plataforma Educativa',
  description: 'Plataforma educativa tipo Google Classroom para gestionar grupos, asignaturas, recursos y comunicacion',
  icons: {
    icon: [
      {
        url: 'https://cdn-icons-png.flaticon.com/512/268/268112.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: 'https://cdn-icons-png.flaticon.com/512/268/268112.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: 'https://cdn-icons-png.flaticon.com/512/268/268112.png',
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
  return (
    <html lang="es" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
