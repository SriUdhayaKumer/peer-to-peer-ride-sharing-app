import { Link } from 'react-router-dom'

const variants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200',
  outline: 'border-2 border-slate-200 text-slate-700 hover:border-primary-300 hover:text-primary-600 hover:bg-primary-50',
  danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-md hover:shadow-lg',
  ghost: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-xl',
  lg: 'px-8 py-4 text-base rounded-2xl',
  full: 'w-full py-3.5 text-base rounded-xl',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  type = 'button',
  className = '',
  icon: Icon,
  loading = false,
  ...props
}) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variantClasses = variants[variant] || variants.primary
  const sizeClasses = sizes[size] || sizes.md

  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <>
          {Icon && <Icon className="w-5 h-5 shrink-0" />}
          {children}
        </>
      )}
    </>
  )

  if (to && !loading) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} disabled={loading} {...props}>
      {content}
    </button>
  )
}
