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
