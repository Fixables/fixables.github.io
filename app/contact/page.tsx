'use client'

import PageWrapper from '@/components/layout/PageWrapper'
import SectionHeading from '@/components/ui/SectionHeading'
import { Mail, Github, Linkedin } from 'lucide-react'

export default function ContactPage() {
  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto px-4 py-24">
        <SectionHeading label="CONTACT" heading="Get in Touch" />
        <p className="text-zinc-400 mt-4 mb-12">
          Open to embedded systems roles, firmware engineering positions, and interesting hardware projects. Feel free to reach out.
        </p>
        <form
          action="https://formsubmit.co/andy.setiawan9910@gmail.com"
          method="POST"
          className="space-y-6"
        >
          <input type="hidden" name="_captcha" value="false" />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="Your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition-colors"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-300 mb-2">Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full px-4 py-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-50 placeholder-zinc-500 focus:outline-none focus:border-sky-400 transition-colors resize-none"
              placeholder="Tell me about your project or role..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-6 rounded-lg bg-sky-400 text-zinc-950 font-semibold hover:bg-sky-300 transition-colors"
          >
            Send Message
          </button>
        </form>
        <div className="mt-12 flex gap-6">
          <a href="https://github.com/Fixables" className="flex items-center gap-2 text-zinc-400 hover:text-sky-400 transition-colors">
            <Github size={20} />
            <span>GitHub</span>
          </a>
          <a href="mailto:andy.setiawan9910@gmail.com" className="flex items-center gap-2 text-zinc-400 hover:text-sky-400 transition-colors">
            <Mail size={20} />
            <span>Email</span>
          </a>
          <a href="https://www.linkedin.com/in/andysetiawan1405/" className="flex items-center gap-2 text-zinc-400 hover:text-sky-400 transition-colors">
            <Linkedin size={20} />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </PageWrapper>
  )
}
