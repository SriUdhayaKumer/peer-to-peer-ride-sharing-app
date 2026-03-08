import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100 p-8">
        <h1 className="text-3xl font-bold text-center">SafeRide App</h1>
        <p className="text-center mt-4">App is working!</p>
      </div>
    </BrowserRouter>
  )
}

export default App
