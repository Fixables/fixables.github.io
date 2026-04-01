import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import Timeline from '@/components/experience/Timeline'
import { experience } from '@/data/experience'

export const metadata = {
  title: 'Experience — Andy Setiawan',
  description: 'Engineering experience, education, and design team involvement.',
}

export default function ExperiencePage() {
  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-24">
        <SectionHeading
          label="04 — EXPERIENCE"
          heading="Background & Timeline"
          subheading="From repair bench to university research to design teams."
          className="mb-16"
        />
        <Timeline entries={experience} />
      </div>
    </PageWrapper>
  )
}
