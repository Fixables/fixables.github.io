'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pcb-bg overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/40 to-zinc-950 pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-3xl"
        >
          <motion.p variants={item} className="font-mono text-sky-400 text-sm tracking-widest uppercase mb-6">
            Embedded Systems · Firmware · PCB Design
          </motion.p>

          <motion.h1
            variants={item}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-zinc-50 tracking-tight leading-[1.05] mb-6"
          >
            Andy Setiawan
          </motion.h1>

          <motion.p variants={item} className="text-xl sm:text-2xl text-zinc-400 font-light leading-relaxed mb-4 max-w-2xl">
            Electrical Engineering student at UBC. Building hardware that moves — motor control, firmware, and PCB design from schematic to silicon.
          </motion.p>

          <motion.p variants={item} className="font-mono text-green-300 text-sm mb-10">
            {'>'} CAD $400k+ merit scholarship · 7 years hands-on electronics repair
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 bg-sky-400 text-zinc-950 font-semibold rounded-lg hover:bg-sky-300 transition-colors"
            >
              View Projects <ArrowRight size={16} />
            </Link>
            <a
              href="/assets/resume.pdf"
              className="inline-flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors"
            >
              Download CV <Download size={16} />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
