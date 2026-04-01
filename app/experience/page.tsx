import PageWrapper from '@/components/layout/PageWrapper'
import Timeline from '@/components/experience/Timeline'
import { experience } from '@/data/experience'

export const metadata = {
  title: 'Experience — Andy Setiawan',
  description: 'My journey so far — work, education, and design teams.',
}

export default function ExperiencePage() {
  const workEntries = experience.filter((e) => e.type === 'work' || e.type === 'design-team' || e.type === 'volunteer')
  const eduEntries = experience.filter((e) => e.type === 'education')

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-16">
          <p className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-3">Background</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight">My journey so far...</h1>
        </div>

        {/* Education */}
        <div className="mb-16">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8 pb-3 border-b border-zinc-800">
            Education
          </h2>
          <Timeline entries={eduEntries} />
        </div>

        {/* Experience */}
        <div>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8 pb-3 border-b border-zinc-800">
            Experience & Design Teams
          </h2>
          <Timeline entries={workEntries} />
        </div>
      </div>
    </PageWrapper>
  )
}
