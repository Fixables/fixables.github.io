import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

export default function AboutSnippet() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-zinc-800">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <AnimatedReveal>
          <SectionHeading
            label="03 — ABOUT"
            heading="Engineering from First Principles"
            className="mb-6"
          />
          <div className="space-y-4 text-zinc-400 leading-relaxed">
            <p>
              I'm an Electrical Engineering student at UBC on a <strong className="text-zinc-200">CAD $400,000+ full-ride merit scholarship</strong>. Before university, I spent 7 years doing hands-on electronics repair at Tjahya Elektronik — diagnosing faults, reworking SMD components, and developing deep intuition for how circuits fail.
            </p>
            <p>
              That bench experience shapes how I design: I think about what breaks first, not just what works on paper. My projects span <strong className="text-zinc-200">FOC motor control</strong>, <strong className="text-zinc-200">RTOS firmware</strong>, <strong className="text-zinc-200">Altium PCB design</strong>, and <strong className="text-zinc-200">robotics systems</strong>.
            </p>
          </div>
          <Link
            href="/experience"
            className="inline-flex items-center gap-2 mt-8 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
          >
            Full experience & background <ArrowRight size={14} />
          </Link>
        </AnimatedReveal>

        <AnimatedReveal delay={0.15}>
          <div className="space-y-4">
            {[
              { label: 'Scholarship', value: 'CAD $400,000+ full-ride merit award', color: '#38bdf8' },
              { label: 'Repair Experience', value: '7 years · Tjahya Elektronik', color: '#86efac' },
              { label: 'Specialization', value: 'Embedded firmware · PCB design · Motor control', color: '#f59e0b' },
              { label: 'Tools', value: 'Altium · STM32 · FreeRTOS · C/C++', color: '#a78bfa' },
            ].map((item) => (
              <div key={item.label} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-start gap-4">
                <span className="w-1 h-full min-h-[2.5rem] rounded-full flex-shrink-0" style={{ background: item.color }} />
                <div>
                  <p className="font-mono text-xs text-zinc-500 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-sm text-zinc-200">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </AnimatedReveal>
      </div>
    </section>
  )
}
