'use client'

import { useState } from 'react'
import PageWrapper from '@/components/layout/PageWrapper'
import Timeline from '@/components/experience/Timeline'
import { experience } from '@/data/experience'

export default function ExperiencePage() {
  const [activeTab, setActiveTab] = useState<'experience' | 'education'>('experience')

  const workEntries = experience.filter(
    (e) => e.type === 'work' || e.type === 'design-team' || e.type === 'volunteer'
  )
  const eduEntries = experience.filter((e) => e.type === 'education')

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <div className="mb-12">
          <p className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-3">Background</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-50 tracking-tight">
            My journey so far...
          </h1>
        </div>

        {/* Tab switch */}
        <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 mb-12">
          <button
            onClick={() => setActiveTab('experience')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'experience'
                ? 'bg-sky-400 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === 'education'
                ? 'bg-sky-400 text-zinc-950'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Education
          </button>
        </div>

        {activeTab === 'experience' && <Timeline entries={workEntries} />}
        {activeTab === 'education' && <Timeline entries={eduEntries} />}
      </div>
    </PageWrapper>
  )
}
