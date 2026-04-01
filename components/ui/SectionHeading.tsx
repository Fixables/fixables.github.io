interface SectionHeadingProps {
  label: string
  heading: string
  subheading?: string
  className?: string
  align?: 'left' | 'center'
}

export default function SectionHeading({
  label,
  heading,
  subheading,
  className = '',
  align = 'left',
}: SectionHeadingProps) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left'
  return (
    <div className={`${alignClass} ${className}`}>
      <p className="font-mono text-xs text-sky-400 tracking-widest uppercase mb-3">{label}</p>
      <h2 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">{heading}</h2>
      {subheading && (
        <p className="mt-3 text-zinc-400 text-base max-w-2xl">{subheading}</p>
      )}
    </div>
  )
}
