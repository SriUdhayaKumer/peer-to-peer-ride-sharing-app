import React from 'react'

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description, 
  variant = 'default',
  className = '',
  onClick 
}) => {
  const baseClasses = 'rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300'
  
  const variantClasses = {
    default: 'bg-white hover:bg-gray-50',
    primary: 'bg-blue-50 hover:bg-blue-100 border border-blue-200',
    success: 'bg-green-50 hover:bg-green-100 border border-green-200',
    warning: 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200',
    danger: 'bg-red-50 hover:bg-red-100 border border-red-200',
  }

  const iconColorClasses = {
    default: 'bg-blue-100 text-blue-600',
    primary: 'bg-blue-100 text-blue-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  }

  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim()

  return (
    <div className={classes} onClick={onClick}>
      {Icon && (
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${iconColorClasses[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard
