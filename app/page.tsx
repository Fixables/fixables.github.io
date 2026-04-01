import Hero from '@/components/sections/Hero'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import SkillsGrid from '@/components/sections/SkillsGrid'
import AboutSnippet from '@/components/sections/AboutSnippet'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <SkillsGrid />
      <AboutSnippet />
    </>
  )
}
