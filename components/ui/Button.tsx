import { forwardRef } from 'react'
import Link from 'next/link'

interface ButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
  external?: boolean
}

const variantClasses = {
  primary: 'bg-sky-400 text-zinc-950 font-semibold hover:bg-sky-300',
  secondary: 'border border-zinc-700 text-zinc-300 hover:border-sky-400 hover:text-sky-400',
  ghost: 'text-zinc-400 hover:text-sky-400',
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm rounded-md',
  md: 'px-6 py-3 text-sm rounded-lg',
  lg: 'px-8 py-4 text-base rounded-lg',
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ href, onClick, variant = 'primary', size = 'md', children, className = '', external = false }, ref) => {
    const classes = `inline-flex items-center gap-2 transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

    if (href) {
      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {children}
          </a>
        )
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      )
    }

    return (
      <button onClick={onClick} className={classes} ref={ref as React.Ref<HTMLButtonElement>}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
