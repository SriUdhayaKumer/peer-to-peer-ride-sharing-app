const express = require('express');
const {
  register,
  login,
  sendOTP,
  verifyOTP,
  verifyIdentity,
  verifyDriver,
  getMe,
  updateProfile,
  updateProfilePhoto
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload').upload;

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/key', (req, res) => {
  res.json({ key: process.env.RAZORPAY_KEY_ID });
});

// Protected routes
router.use(auth); // Apply auth middleware to all routes below

router.get('/me', getMe);
router.put('/profile', updateProfile);

// File upload routes - using simple approach
router.post('/verify-identity', 
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'selfie', maxCount: 1 }
  ]), 
  verifyIdentity
);

router.post('/verify-driver', 
  upload.fields([
    { name: 'drivingLicense', maxCount: 1 },
    { name: 'vehicleRegistration', maxCount: 1 },
    { name: 'vehiclePhoto', maxCount: 1 }
  ]), 
  verifyDriver
);

router.post('/update-profile-photo',
  upload.single('profilePhoto'),
  updateProfilePhoto
);

module.exports = router;
