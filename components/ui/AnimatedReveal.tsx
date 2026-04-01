'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface AnimatedRevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
  once?: boolean
}

export default function AnimatedReveal({
  children,
  delay = 0,
  className = '',
  once = true,
}: AnimatedRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once, margin: '-10% 0px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
