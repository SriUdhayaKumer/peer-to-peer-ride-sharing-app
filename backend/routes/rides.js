const express = require('express');
const {
  postRide,
  searchRides,
  getRideDetails,
  bookRide,
  confirmRide,
  startRide,
  completeRide,
  cancelRide,
  updateDriverLocation,
  triggerSOS,
  verifyRideQR,
  getRideHistory,
  getMyRides
} = require('../controllers/rideController');
const { auth, driverAuth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/search', searchRides);
router.get('/:id', getRideDetails);

// Protected routes
router.use(auth);

// Passenger routes
router.post('/:id/book', bookRide);
router.post('/:id/verify', verifyRideQR);

// Driver routes
router.post('/', driverAuth, postRide);
router.post('/:id/confirm', driverAuth, confirmRide);
router.post('/:id/start', driverAuth, startRide);
router.post('/:id/complete', driverAuth, completeRide);
router.post('/:id/location', driverAuth, updateDriverLocation);

// Both driver and passenger
router.post('/:id/cancel', cancelRide);
router.post('/:id/sos', triggerSOS);

// User history
router.get('/history/me', getRideHistory);
router.get('/my-rides', auth, getMyRides);

module.exports = router;
