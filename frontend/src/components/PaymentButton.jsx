import { useState } from 'react'
import { CreditCardIcon, WalletIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

const PaymentButton = ({ 
  amount, 
  onPaymentSuccess, 
  onPaymentFailure,
  disabled = false,
  className = ''
}) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState('upi')

  const paymentMethods = [
    {
      id: 'upi',
      name: 'UPI',
      icon: BuildingLibraryIcon,
      description: 'Pay using UPI apps',
    },
    {
      id: 'card',
      name: 'Card',
      icon: CreditCardIcon,
      description: 'Credit/Debit cards',
    },
    {
      id: 'wallet',
      name: 'Wallet',
      icon: WalletIcon,
      description: 'SafeRide wallet balance',
    },
  ]

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Simulate payment success (90% success rate)
      const isSuccess = Math.random() > 0.1

      if (isSuccess) {
        onPaymentSuccess?.({
          method: selectedMethod,
          amount,
          transactionId: 'txn_' + Date.now(),
          timestamp: new Date().toISOString(),
        })
      } else {
        throw new Error('Payment failed')
      }
    } catch (error) {
      onPaymentFailure?.(error.message)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className={`bg-white rounded-2xl p-6 shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Method</h3>
      
      {/* Payment Methods */}
      <div className="space-y-3 mb-6">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            onClick={() => setSelectedMethod(method.id)}
            disabled={disabled || isProcessing}
            className={`
              w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all
              ${selectedMethod === method.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
              }
              ${(disabled || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              selectedMethod === method.id ? 'bg-blue-100' : 'bg-gray-100'
            }`}>
              <method.icon className={`w-5 h-5 ${
                selectedMethod === method.id ? 'text-blue-600' : 'text-gray-600'
              }`} />
            </div>
            <div className="flex-1 text-left">
              <p className="font-medium text-slate-900">{method.name}</p>
              <p className="text-sm text-slate-600">{method.description}</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 ${
              selectedMethod === method.id 
                ? 'border-blue-500 bg-blue-500' 
                : 'border-gray-300'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-full h-full rounded-full bg-white scale-50"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Amount Display */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-slate-600">Total Amount</span>
          <span className="text-2xl font-bold text-slate-900">₹{amount}</span>
        </div>
      </div>

      {/* Payment Button */}
      <button
        onClick={handlePayment}
        disabled={disabled || isProcessing}
        className={`
          w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300
          text-white font-semibold py-4 px-6 rounded-xl
          transition-all duration-200 flex items-center justify-center gap-3
          ${(disabled || isProcessing) ? 'cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCardIcon className="w-5 h-5" />
            <span>Pay ₹{amount}</span>
          </>
        )}
      </button>

      {/* Security Note */}
      <div className="mt-4 text-center">
        <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 10-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Secured by 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}

export default PaymentButton
