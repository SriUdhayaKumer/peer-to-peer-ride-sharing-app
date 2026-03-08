import { useState } from 'react'
import api from '../services/api'

export default function TestPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult('')
    
    try {
      // Test health endpoint
      const healthResponse = await api.get('/health')
      setResult(`Health: ${JSON.stringify(healthResponse.data)}`)
      
      // Test register
      const registerResponse = await api.post('/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        phone: '9876543210',
        password: 'password123'
      })
      setResult(prev => prev + `\n\nRegister: ${JSON.stringify(registerResponse.data)}`)
      
      // Test login
      const loginResponse = await api.post('/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      })
      setResult(prev => prev + `\n\nLogin: ${JSON.stringify(loginResponse.data)}`)
      
    } catch (error) {
      setResult(`Error: ${error.message}\n\nResponse: ${JSON.stringify(error.response?.data)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <button
          onClick={testAPI}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testing...' : 'Test API'}
        </button>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Results:</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {result || 'Click "Test API" to see results'}
          </pre>
        </div>
      </div>
    </div>
  )
}
