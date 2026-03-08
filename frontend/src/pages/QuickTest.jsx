import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function QuickTest() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('')

  const testLogin = async () => {
    setStatus('Testing...')
    
    try {
      // Test registration first
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          phone: '9876543210',
          password: 'password123'
        })
      })
      
      const registerData = await registerResponse.json()
      setStatus(`Register: ${JSON.stringify(registerData)}`)
      
      // Test login
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
      
      const loginData = await loginResponse.json()
      setStatus(prev => prev + `\n\nLogin: ${JSON.stringify(loginData)}`)
      
      if (loginData.success) {
        localStorage.setItem('safaride_token', loginData.token)
        localStorage.setItem('safaride_user', JSON.stringify(loginData.user))
        localStorage.setItem('safaride_auth', 'true')
        setTimeout(() => navigate('/home'), 1000)
      }
      
    } catch (error) {
      setStatus(`Error: ${error.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Quick Test</h1>
          
          <button
            onClick={testLogin}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 mb-4"
          >
            Test Register & Login
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 mb-4"
          >
            Go to Home Page
          </button>
          
          <button
            onClick={() => navigate('/simple-login')}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700"
          >
            Simple Login Test
          </button>
          
          {status && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Status:</h3>
              <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                {status}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
