'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] } },
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-32 w-full">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="flex flex-col sm:flex-row items-center sm:items-start gap-10"
        >
          {/* Profile photo */}
          <motion.div variants={item} className="flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden border-2 border-zinc-800 bg-zinc-900">
              <Image
                src="/assets/DSCF4746-rd.png"
                alt="Andy Setiawan"
                width={176}
                height={176}
                className="object-cover w-full h-full"
                priority
              />
            </div>
          </motion.div>

          {/* Text */}
          <div className="text-center sm:text-left">
            <motion.p variants={item} className="text-zinc-400 text-base mb-3">
              Hey there! 👋
            </motion.p>

            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-50 tracking-tight leading-tight mb-4"
            >
              I'm Andy Setiawan
            </motion.h1>

            <motion.p variants={item} className="text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl">
              Electrical Engineering student at UBC — I love building things, breaking things, and figuring out why they broke.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-4 justify-center sm:justify-start">
              <Link
                href="/projects"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-sky-400 text-zinc-950 font-semibold rounded-lg hover:bg-sky-300 transition-colors text-sm"
              >
                See my work <ArrowRight size={15} />
              </Link>
              <a
                href="/assets/cv-andy.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-700 text-zinc-300 rounded-lg hover:border-sky-400 hover:text-sky-400 transition-colors text-sm"
              >
                Download CV <Download size={15} />
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
