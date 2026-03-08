const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const auth = require('../middleware/auth');

// Get verification status
router.get('/status', auth, verificationController.getVerificationStatus);

// Get AI recommendations
router.get('/recommendations', auth, verificationController.getRecommendations);

module.exports = router;
