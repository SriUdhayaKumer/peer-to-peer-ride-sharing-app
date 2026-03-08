import { useState } from 'react'

export default function SimpleConnectionTest() {
  const [results, setResults] = useState('')

  const testConnection = async () => {
    setResults('Testing connection...')
    
    try {
      // Test 1: Health endpoint
      const healthResponse = await fetch('http://localhost:5000/api/health')
      const healthData = await healthResponse.json()
      
      setResults(prev => prev + `\n✅ Health: ${JSON.stringify(healthData)}`)
      
      // Test 2: Register endpoint
      const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: `test${Date.now()}@example.com`,
          phone: '9876543210',
          password: 'password123'
        })
      })
      
      const registerData = await registerResponse.json()
      setResults(prev => prev + `\n✅ Register: ${JSON.stringify(registerData)}`)
      
      if (registerData.success) {
        setResults(prev => prev + `\n🎉 SUCCESS: API is working!`)
      } else {
        setResults(prev => prev + `\n❌ Register failed: ${registerData.message}`)
      }
      
    } catch (error) {
      setResults(`❌ ERROR: ${error.message}\n\nThis might be a CORS issue. Check the browser console for more details.`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Connection Test</h1>
          
          <div className="space-y-4">
            <button
              onClick={testConnection}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700"
            >
              Test API Connection
            </button>
            
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="font-semibold mb-2">Test Results:</h3>
              <pre className="text-sm whitespace-pre-wrap">
                {results || 'Click "Test API Connection" to start testing'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
