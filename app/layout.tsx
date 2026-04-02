import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import PageBackground from '@/components/layout/PageBackground'
import OpAmpCursor from '@/components/layout/OpAmpCursor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Andy Setiawan — Embedded Systems & Firmware Engineer',
  description: 'Portfolio of Andy Setiawan. Embedded systems, firmware, PCB design, motor control, RTOS, robotics.',
  keywords: ['embedded systems', 'firmware', 'PCB design', 'motor control', 'RTOS', 'robotics', 'Altium', 'STM32'],
  openGraph: {
    title: 'Andy Setiawan — Embedded Systems & Firmware Engineer',
    description: 'Portfolio of Andy Setiawan. Embedded systems, firmware, PCB design, motor control, RTOS, robotics.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-zinc-950 text-zinc-50 font-sans antialiased">
        <OpAmpCursor />
        <PageBackground />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
