const express = require('express');
const {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  getPaymentHistory,
  processRefund,
  getRazorpayKey
} = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/key', getRazorpayKey);

// Protected routes
router.use(auth);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);
router.get('/:id', getPaymentDetails);
router.get('/history/me', getPaymentHistory);
router.post('/:id/refund', processRefund);

module.exports = router;
