import { skillCategories } from '@/data/skills'
import SectionHeading from '@/components/ui/SectionHeading'
import AnimatedReveal from '@/components/ui/AnimatedReveal'

export default function SkillsGrid() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 border-t border-zinc-800">
      <AnimatedReveal>
        <SectionHeading
          label="02 — SKILLS"
          heading="Technical Expertise"
          subheading="Grouped by domain. Deep hands-on experience from repair bench to firmware to PCB layout."
          className="mb-12"
        />
      </AnimatedReveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((category, i) => (
          <AnimatedReveal key={category.id} delay={i * 0.08}>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: category.color }}
                />
                <h3 className="text-sm font-semibold text-zinc-200">{category.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs text-zinc-400 bg-zinc-800 border border-zinc-700/50 px-2.5 py-1 rounded-md"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </AnimatedReveal>
        ))}
      </div>
    </section>
  )
}
