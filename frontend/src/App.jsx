import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { RideProvider } from './context/RideContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import PostRidePage from './pages/PostRidePage'
import SearchRidePage from './pages/SearchRidePage'
import RideViewPage from './pages/RideViewPage'
import RequestRidePage from './pages/RequestRidePage'
import LiveTrackingPage from './pages/LiveTrackingPage'
import PaymentPage from './pages/PaymentPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import RatingPage from './pages/RatingPage'
import MyRidesPage from './pages/MyRidesPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import TestPage from './pages/TestPage'
import SimpleLoginPage from './pages/SimpleLoginPage'
import QuickTest from './pages/QuickTest'
import DirectAPITest from './pages/DirectAPITest'
import FixedProfileSetup from './pages/FixedProfileSetup'
import SimpleConnectionTest from './pages/SimpleConnectionTest'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

// Public Route Component (redirects to home if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }
  
  return children
}

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RideProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={
              <PublicLayout>
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              </PublicLayout>
            } />
            <Route path="/profile-setup" element={
              <PublicLayout>
                <PublicRoute>
                  <ProfileSetupPage />
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
            
            {/* Protected Routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <AuthLayout><HomePage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/search" element={
              <ProtectedRoute>
                <AuthLayout><SearchRidePage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/ride-view/:id" element={
              <ProtectedRoute>
                <AuthLayout><RideViewPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/request-ride/:id" element={
              <ProtectedRoute>
                <AuthLayout><RequestRidePage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/payment/:id" element={
              <ProtectedRoute>
                <AuthLayout><PaymentPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/payment-success" element={
              <ProtectedRoute>
                <AuthLayout><PaymentSuccessPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/live-tracking" element={
              <ProtectedRoute>
                <AuthLayout><LiveTrackingPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/post-ride" element={
              <ProtectedRoute>
                <AuthLayout><PostRidePage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <AuthLayout><DashboardPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <AuthLayout><ProfilePage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-rides" element={
              <ProtectedRoute>
                <AuthLayout><MyRidesPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/rating" element={
              <ProtectedRoute>
                <AuthLayout><RatingPage /></AuthLayout>
              </ProtectedRoute>
            } />
            <Route path="/test" element={
              <PublicLayout>
                <TestPage />
              </PublicLayout>
            } />
            <Route path="/simple-login" element={
              <PublicLayout>
                <SimpleLoginPage />
              </PublicLayout>
            } />
            <Route path="/quick-test" element={
              <PublicLayout>
                <QuickTest />
              </PublicLayout>
            } />
            <Route path="/direct-test" element={
              <PublicLayout>
                <DirectAPITest />
              </PublicLayout>
            } />
            <Route path="/fixed-setup" element={
              <PublicLayout>
                <FixedProfileSetup />
              </PublicLayout>
            } />
            <Route path="/connection-test" element={
              <PublicLayout>
                <SimpleConnectionTest />
              </PublicLayout>
            } />
          </Routes>
        </RideProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
