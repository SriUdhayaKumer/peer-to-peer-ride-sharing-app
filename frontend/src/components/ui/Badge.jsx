const variants = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary-100 text-primary-600',
  success: 'bg-success-50 text-success-600',
  danger: 'bg-danger-50 text-danger-600',
  warning: 'bg-warning-50 text-warning-600',
}

export default function Badge({ children, variant = 'default', className = '' }) {
  const variantClasses = variants[variant] || variants.default
  return (
    <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${variantClasses} ${className}`}>
      {children}
    </span>
  )
}
