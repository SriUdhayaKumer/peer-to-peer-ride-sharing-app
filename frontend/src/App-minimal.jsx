import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Test minimal imports first
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Simplified version without AuthContext for testing
  return children
}

const PublicRoute = ({ children }) => {
  return children
}

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </div>
)

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          <PublicLayout>
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          </PublicLayout>
        } />
        <Route path="/login" element={
          <PublicLayout>
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          </PublicLayout>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
