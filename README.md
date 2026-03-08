<<<<<<< HEAD
# SafeRide – Smart & Safe Peer-to-Peer Ride Sharing Platform

A comprehensive ride-sharing platform that addresses major safety and transparency issues found in current ride-sharing services like Rapido.

## 🚀 Features

### 🔐 Safety & Security
- **Mandatory Identity Verification** - Government ID and selfie verification
- **Driver Verification System** - License, vehicle registration, and photo verification
- **SOS Emergency Button** - One-tap emergency alert with location sharing
- **QR Ride Verification** - Secure ride confirmation before starting
- **Live Ride Tracking** - Real-time location sharing with family

### 💰 Transparent Pricing
- **Locked Fares** - Prices cannot be changed after booking
- **Clear Fare Breakdown** - Base fare, distance cost, platform fee, GST
- **No Hidden Charges** - Complete transparency in pricing
- **Fair Driver Earnings** - Transparent commission structure

### 🛡️ Trust & Reliability
- **Verified Badges** - Visual indicators for verified drivers
- **Rating System** - Two-way rating for passengers and drivers
- **Ride History** - Complete trip records
- **Emergency Contacts** - Quick access to help

### 📱 Modern UI/UX
- **Mobile-First Design** - Responsive layout for all devices
- **Real-Time Updates** - Live notifications and status updates
- **Intuitive Navigation** - Easy-to-use interface
- **Smooth Animations** - Modern, polished experience

## 🛠 Tech Stack

### Frontend
- **React** - Functional components with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Modern styling framework
- **Axios** - HTTP client for API calls
- **Heroicons** - Beautiful icon library
- **Razorpay** - Payment gateway integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **Razorpay** - Payment processing

### Database
- **MongoDB** - Primary database
- **Mongoose** - Object Data Modeling

## 📁 Project Structure

```
ride/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Navbar.jsx
│   │   │   ├── RideCard.jsx
│   │   │   ├── MapComponent.jsx
│   │   │   ├── SOSButton.jsx
│   │   │   ├── PaymentButton.jsx
│   │   │   └── ProfileDropdown.jsx
│   │   ├── pages/           # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProfileSetupPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── SearchRidePage.jsx
│   │   │   ├── RideDetailsPage.jsx
│   │   │   ├── LiveTrackingPage.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── PaymentSuccessPage.jsx
│   │   │   ├── RatingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   └── ProfilePage.jsx
│   │   ├── context/         # React context
│   │   │   ├── AuthContext.jsx
│   │   │   └── RideContext.jsx
│   │   ├── services/        # API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── rideService.js
│   │   │   └── paymentService.js
│   │   └── utils/           # Utility functions
│   │       ├── fareCalculator.js
│   │       └── locationHelpers.js
│   ├── package.json
│   └── vite.config.js
└── backend/                  # Node.js backend
    ├── controllers/         # Route controllers
    │   ├── authController.js
    │   ├── rideController.js
    │   └── paymentController.js
    ├── models/              # Database models
    │   ├── User.js
    │   ├── Ride.js
    │   └── Payment.js
    ├── routes/              # API routes
    │   ├── auth.js
    │   ├── rides.js
    │   └── payment.js
    ├── middleware/          # Express middleware
    │   ├── auth.js
    │   └── upload.js
    ├── utils/               # Utility functions
    │   ├── database.js
    │   └── fareCalculator.js
    ├── uploads/             # File uploads
    ├── .env
    ├── package.json
    └── server.js
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (installed and running)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ride
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   - Copy `backend/.env.example` to `backend/.env`
   - Update environment variables:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/safaride
     JWT_SECRET=your-super-secret-jwt-key
     RAZORPAY_KEY_ID=your-razorpay-key-id
     RAZORPAY_KEY_SECRET=your-razorpay-key-secret
     FRONTEND_URL=http://localhost:5174
     ```

### Running the Application

1. **Start MongoDB**
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5174`

## 📱 Application Flow

### 1. Landing Page
- Public entry point with hero section
- Features showcase and safety highlights
- Call-to-action buttons for registration

### 2. Profile Setup (3 Steps)
- **Step 1**: Basic information (name, email, phone)
- **Step 2**: Identity verification (government ID + selfie)
- **Step 3**: Driver verification (optional - for posting rides)

### 3. Login
- Email/password authentication
- OTP-based phone verification
- JWT token generation

### 4. Main Application
- **Dashboard**: Personalized home screen
- **Search Rides**: Find available rides
- **Post Rides**: Offer rides (driver verified only)
- **Live Tracking**: Real-time ride monitoring
- **Payments**: Secure Razorpay integration

## 🔐 Authentication & Authorization

### JWT Authentication
- Secure token-based authentication
- Automatic token refresh
- Protected routes with middleware

### User Roles
- **Passenger**: Can book and rate rides
- **Driver**: Can post rides (after verification)
- **Both**: Full access to all features

### Verification Levels
- **Identity Verified**: Government ID + selfie
- **Driver Verified**: Additional vehicle documentation

## 💳 Payment System

### Razorpay Integration
- Secure payment processing
- Multiple payment methods (UPI, Card, Wallet)
- Automatic receipt generation
- Refund support

### Transaction Flow
1. Create payment order
2. Razorpay checkout
3. Payment verification
4. Ride confirmation
5. Receipt generation

## 🚨 Safety Features

### SOS Emergency System
- One-tap emergency button
- Location sharing with emergency contacts
- Ride and user details logging
- Backend emergency alert system

### Live Tracking
- Real-time driver location updates
- Route path visualization
- ETA calculations
- Trip progress monitoring

### QR Verification
- Unique QR code per ride
- Passenger scan verification
- Prevents unauthorized ride starts
- Secure ride confirmation

## 📊 Transparent Pricing

### Fare Calculation
```
Total Fare = Base Fare + (Distance × Rate/km) + Platform Fee + GST
```

### Vehicle Rates
- **Bike**: ₹8/km
- **Auto**: ₹12/km
- **Car**: ₹15/km
- **SUV**: ₹20/km
- **Van**: ₹25/km

### Driver Earnings
- Transparent commission structure
- Fuel cost estimation
- Earnings dashboard
- Performance analytics

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/verify-identity` - Identity verification
- `POST /api/auth/verify-driver` - Driver verification

### Rides
- `GET /api/rides/search` - Search rides
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides` - Post ride (driver only)
- `POST /api/rides/:id/book` - Book ride
- `POST /api/rides/:id/sos` - Emergency alert
- `POST /api/rides/:id/verify` - QR verification

### Payments
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment
- `GET /api/payment/key` - Get Razorpay key

## 🧪 Testing

### Running Tests
```bash
# Frontend tests
cd frontend
npm test

# Backend tests
cd backend
npm test
```

### API Testing
Use Postman or curl to test API endpoints:
```bash
curl http://localhost:5000/api/health
```

## 🚀 Deployment

### Frontend Deployment
```bash
cd frontend
npm run build
# Deploy the dist/ folder to your hosting service
```

### Backend Deployment
```bash
cd backend
npm start
# Configure environment variables for production
```

### Environment Variables
Required for production:
- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Email: support@safaride.com
- Documentation: [Link to docs]

## 🌟 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Razorpay for the payment gateway
- MongoDB for the database solution
- All contributors and users of SafeRide

---

**SafeRide** - Making ride sharing safer, fairer, and more transparent for everyone. 🚗✨
=======
# SmartRide - Peer-to-Peer Ride Sharing Platform

A modern, responsive frontend for a peer-to-peer smart ride sharing platform built with React, Tailwind CSS, and Vite.

## Tech Stack

- **React** (Functional Components)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Heroicons** for icons
- **Vite** for build tooling

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── RideCard.jsx
│   ├── LoadingSkeleton.jsx
│   └── Toast.jsx
├── pages/           # Page components
│   ├── HomePage.jsx
│   ├── LoginPage.jsx
│   ├── ProfileSetupPage.jsx
│   ├── PostRidePage.jsx
│   ├── SearchRidePage.jsx
│   ├── RideDetailsPage.jsx
│   ├── LiveTrackingPage.jsx
│   ├── PaymentSuccessPage.jsx
│   ├── RatingPage.jsx
│   └── DashboardPage.jsx
├── data/            # Static dummy data
│   └── dummyData.js
├── assets/          # Static assets
├── App.jsx
├── main.jsx
└── index.css
```

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, features, and how it works |
| `/login` | Login / Register with OTP and role selection |
| `/register` | Same as login (register mode) |
| `/profile-setup` | Profile setup with vehicle details |
| `/post-ride` | Post a ride (Provider) |
| `/search` | Search rides (Seeker) |
| `/ride-details/:id` | Ride details with accept/cancel |
| `/live-tracking` | Live tracking UI with map placeholder |
| `/payment-success` | Payment success confirmation |
| `/rating` | Rate and feedback |
| `/dashboard` | Dashboard for Provider/Seeker |

## Features

- Fully responsive design (mobile & desktop)
- Light theme with blue & green gradients
- Dummy/static JSON data (no backend)
- Loading skeleton cards
- Toast notification component (UI only)
- Smooth transitions and animations
- Clean navbar with profile dropdown
>>>>>>> 2b57a3cfbb28a8dd43b671ad1626aa6c5bc76b53
