const express = require('express');
const router = express.Router();
const { getVerificationStatus, getRecommendations } = require('../controllers/verificationController-new');
const { auth } = require('../middleware/auth');

// Get verification status
router.get('/status', auth, getVerificationStatus);

// Get AI recommendations
router.get('/recommendations', auth, getRecommendations);

module.exports = router;
