import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DirectAPITest() {
  const navigate = useNavigate()
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testDirectAPI = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test register directly
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123'
      }
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData)
      })
      
      const data = await response.json()
      setResult(`Register Response: ${JSON.stringify(data, null, 2)}`)
      
      if (data.success) {
        // Store token and user data
        localStorage.setItem('safaride_token', data.token)
        localStorage.setItem('safaride_user', JSON.stringify(data.user))
        localStorage.setItem('safaride_auth', 'true')
        
        // Navigate to home after successful registration
        setTimeout(() => {
          navigate('/home')
        }, 1000)
      }
      
    } catch (error) {
      setResult(`Error: ${error.message}\n\nStack: ${error.stack}`)
    } finally {
      setLoading(false)
    }
  }

  const testWithAxios = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Import axios dynamically
      const axios = (await import('axios')).default
      
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123'
      }
      
      const response = await axios.post('http://localhost:5000/api/auth/register', registerData, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      setResult(`Axios Response: ${JSON.stringify(response.data, null, 2)}`)
      
      if (response.data.success) {
        localStorage.setItem('safaride_token', response.data.token)
        localStorage.setItem('safaride_user', JSON.stringify(response.data.user))
        localStorage.setItem('safaride_auth', 'true')
        
        setTimeout(() => {
          navigate('/home')
        }, 1000)
      }
      
    } catch (error) {
      setResult(`Axios Error: ${error.message}\n\nResponse: ${JSON.stringify(error.response?.data, null, 2)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Direct API Test</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={testDirectAPI}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Direct Fetch API'}
            </button>
            
            <button
              onClick={testWithAxios}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test with Axios'}
            </button>
            
            <button
              onClick={() => navigate('/profile-setup')}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700"
            >
              Go to Profile Setup
            </button>
          </div>
          
          {result && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-x-auto max-h-96 overflow-y-auto">
                {result}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
