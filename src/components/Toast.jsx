import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export default function Toast({ message, type = 'success', onClose }) {
  const config = {
    success: {
      icon: CheckCircleIcon,
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-600',
    },
    error: {
      icon: XCircleIcon,
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-600',
    },
    info: {
      icon: InformationCircleIcon,
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-600',
    },
  }

  const { icon: Icon, bg, text, iconColor } = config[type]

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-card border ${bg} animate-slide-up`}
      role="alert"
    >
      <Icon className={`w-6 h-6 ${iconColor} flex-shrink-0`} />
      <p className={`font-medium ${text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>
      )}
    </div>
  )
}
