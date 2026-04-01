import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

const currentYear = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">
          © {currentYear} Andy Setiawan. Built with Next.js + Tailwind.
        </p>
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/Fixables"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-sky-400 transition-colors"
            aria-label="GitHub"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/andysetiawan1405/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-sky-400 transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="mailto:andy.setiawan9910@gmail.com"
            className="text-zinc-500 hover:text-sky-400 transition-colors"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
