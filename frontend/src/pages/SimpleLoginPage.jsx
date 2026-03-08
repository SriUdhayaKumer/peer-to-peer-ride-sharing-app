import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export default function SimpleLoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleLogin = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // First try to register the user
      const registerResponse = await api.post('/auth/register', {
        name: 'Test User',
        email: email,
        phone: '9876543210',
        password: password
      })
      
      setResult(`Register: ${JSON.stringify(registerResponse.data)}`)
      
      // Then try to login
      const loginResponse = await api.post('/auth/login', {
        email: email,
        password: password
      })
      
      setResult(prev => prev + `\n\nLogin: ${JSON.stringify(loginResponse.data)}`)
      
      // Store token and navigate
      if (loginResponse.data.success) {
        localStorage.setItem('safaride_token', loginResponse.data.token)
        localStorage.setItem('safaride_user', JSON.stringify(loginResponse.data.user))
        localStorage.setItem('safaride_auth', 'true')
        navigate('/home')
      }
      
    } catch (error) {
      setResult(`Error: ${error.message}\n\nResponse: ${JSON.stringify(error.response?.data)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Simple Login Test</h1>
          
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Register & Login'}
          </button>
          
          <div className="mt-4">
            <button
              onClick={() => navigate('/test')}
              className="text-blue-600 hover:text-blue-800 text-sm"
            >
              Go to API Test Page
            </button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Results:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
