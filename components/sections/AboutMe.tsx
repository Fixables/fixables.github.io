import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

export default function AboutMe() {
  return (
    <section id="about" className="max-w-6xl mx-auto px-4 sm:px-6 py-20 border-t border-zinc-800/60">
      <AnimatedReveal>
        <p className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-3">About Me</p>
        <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight mb-10">
          Nice to meet you
        </h2>
      </AnimatedReveal>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Photo + quick facts */}
        <AnimatedReveal>
          <div className="flex flex-col items-center lg:items-start gap-6">
            <div className="w-56 h-64 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 flex-shrink-0">
              <Image
                src="/assets/about-pic.jpg"
                alt="Andy Setiawan"
                width={224}
                height={256}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="space-y-2 text-sm text-zinc-500">
              <p>📍 Vancouver, BC (from Bali, Indonesia)</p>
              <p>🎓 B.A.Sc Electrical Engineering @ UBC</p>
              <p>🔧 7+ years tinkering with electronics</p>
            </div>
          </div>
        </AnimatedReveal>

        {/* Bio */}
        <AnimatedReveal delay={0.1}>
          <div className="space-y-5 text-zinc-400 leading-relaxed text-base">
            <p>
              Heya! I'm Andy — an Electrical Engineering student at UBC with a soft spot for building robots, automating things, and fixing whatever others gave up on.
            </p>
            <p>
              I grew up in Bali, Indonesia, where I spent most of my teenage years helping out at my family's electronics repair shop, Tjahya Elektronik. That's where I fell in love with how circuits actually work — not from a textbook, but from diagnosing dead TVs, rewiring speakers, and soldering for hours. It gave me a different kind of intuition: I think about what breaks first, not just what works on paper.
            </p>
            <p>
              These days I'm deep into firmware, motor control, and PCB design — mostly through coursework, design teams, and personal projects. I'm always up for a good technical challenge (or a good chat about tech).
            </p>
            <p className="text-zinc-500 text-sm">
              I'm also grateful to be here on a full-ride Indonesia Maju scholarship (CAD $400k+), which has made studying abroad possible.
            </p>
          </div>

          <Link
            href="/experience"
            className="inline-flex items-center gap-2 mt-8 text-sky-400 hover:text-sky-300 transition-colors text-sm font-medium"
          >
            My full background <ArrowRight size={14} />
          </Link>
        </AnimatedReveal>
      </div>
    </section>
  )
}
