import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  PhoneIcon,
  IdentificationIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

export default function LoginPage() {
  const navigate = useNavigate()

  const [isLogin, setIsLogin] = useState(false)
  const [step, setStep] = useState(1)

  const [formData, setFormData] = useState({
    mobile: '',
    role: '',
    idProof: null,
  })

  const handleSubmit = (e) => {
    e.preventDefault()

    // ---------------- REGISTER FLOW ----------------
    if (!isLogin) {
      if (step === 1) {
        setStep(2)
      } 
      else if (step === 2) {
        if (!formData.role || !formData.idProof) return
        setStep(3)
      } 
      else if (step === 3) {
        setIsLogin(true)
        setStep(1)
      }
    }

    // ---------------- LOGIN FLOW ----------------
    else {
      navigate('/')
    }
  }

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setFormData({ ...formData, idProof: file })
    }
  }

  return (
    <div className="py-16 flex items-center justify-center min-h-[60vh] bg-gray-50">
      <div className="w-full max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600">
            {isLogin ? 'Sign in to continue' : 'Join P2P Smart Ride'}
          </p>
        </div>

        <Card className="p-8 shadow-xl">

          {/* Toggle */}
          <div className="flex rounded-xl bg-gray-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => { setIsLogin(false); setStep(1); }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                !isLogin ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(true); setStep(1); }}
              className={`flex-1 py-2.5 rounded-lg font-medium transition-all ${
                isLogin ? 'bg-white shadow-sm text-primary-600' : 'text-gray-600'
              }`}
            >
              Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* STEP 1 - MOBILE */}
            {step === 1 && (
              <Input
                label="Mobile Number"
                type="tel"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
                placeholder="+91 98765 43210"
                icon={PhoneIcon}
                required
              />
            )}

            {/* STEP 2 REGISTER DETAILS */}
            {step === 2 && !isLogin && (
              <div className="space-y-6">

                {/* OTP */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OTP Verification
                  </label>
                  <div className="flex gap-2">
                    {[1,2,3,4,5,6].map(i => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-12 h-12 text-center text-lg font-semibold rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    ))}
                  </div>
                </div>

                {/* ID Upload with Drag & Drop */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Government ID Upload
                  </label>

                  <label
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary-500 rounded-xl p-8 text-center transition-all block"
                  >
                    <IdentificationIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />

                    <p className="text-gray-600 font-medium">
                      Click or Drag & Drop to upload Aadhaar / Driving License
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG, PDF (Max 5MB)
                    </p>

                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          idProof: e.target.files[0],
                        })
                      }
                      required
                    />
                  </label>

                  {formData.idProof && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {formData.idProof.name}
                    </p>
                  )}
                </div>

                {/* ROLE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Choose Role
                  </label>
                  <div className="grid grid-cols-2 gap-4">

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'provider' })}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                        formData.role === 'provider'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <TruckIcon className="w-8 h-8 text-gray-400" />
                      <span className="font-medium">Ride Provider</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'seeker' })}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 ${
                        formData.role === 'seeker'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <MagnifyingGlassIcon className="w-8 h-8 text-gray-400" />
                      <span className="font-medium">Ride Seeker</span>
                    </button>

                  </div>
                </div>

              </div>
            )}

            {/* STEP 3 SUCCESS */}
            {step === 3 && !isLogin && (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <ArrowRightIcon className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600 mb-6">
                  Account created successfully!
                </p>
              </div>
            )}

            {/* BUTTONS */}
            <div className="flex gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium"
                >
                  Back
                </button>
              )}
              <Button type="submit" variant="primary" size="full" className="flex-1">
                {isLogin
                  ? 'Sign In'
                  : step === 2
                  ? 'Create Account'
                  : 'Get OTP'}
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </div>
  )
}