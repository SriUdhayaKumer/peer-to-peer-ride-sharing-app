const variants = {
  default: 'bg-white border border-slate-100 shadow-md',
  elevated: 'bg-white border border-slate-100 shadow-lg hover:shadow-xl',
  muted: 'bg-slate-50 border border-slate-100',
}

export default function Card({
  children,
  variant = 'default',
  className = '',
  hover = false,
  padding = true,
  ...props
}) {
  const baseClasses = 'rounded-2xl transition-all duration-200'
  const variantClasses = variants[variant] || variants.default
  const hoverClasses = hover ? 'hover:-translate-y-0.5 hover:shadow-lg' : ''
  const paddingClasses = padding ? 'p-6' : ''

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${hoverClasses} ${paddingClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
