import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfileSetupPage from './pages/ProfileSetupPage'
import PostRidePage from './pages/PostRidePage'
import SearchRidePage from './pages/SearchRidePage'
import RideDetailsPage from './pages/RideDetailsPage'
import LiveTrackingPage from './pages/LiveTrackingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import RatingPage from './pages/RatingPage'
import DashboardPage from './pages/DashboardPage'

const Layout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/login" element={<Layout><LoginPage /></Layout>} />
        <Route path="/register" element={<Layout><LoginPage /></Layout>} />
        <Route path="/profile-setup" element={<Layout><ProfileSetupPage /></Layout>} />
        <Route path="/post-ride" element={<Layout><PostRidePage /></Layout>} />
        <Route path="/search" element={<Layout><SearchRidePage /></Layout>} />
        <Route path="/ride-details/:id" element={<Layout><RideDetailsPage /></Layout>} />
        <Route path="/live-tracking" element={<Layout><LiveTrackingPage /></Layout>} />
        <Route path="/payment-success" element={<Layout><PaymentSuccessPage /></Layout>} />
        <Route path="/rating" element={<Layout><RatingPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
