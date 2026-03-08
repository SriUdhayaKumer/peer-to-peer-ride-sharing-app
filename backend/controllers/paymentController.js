const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const Ride = require('../models/Ride');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create payment order
// @route   POST /api/payment/create-order
// @access  Private
const createPaymentOrder = async (req, res) => {
  try {
    const { rideId, amount } = req.body;

    if (!rideId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Ride ID and amount are required'
      });
    }

    // Verify ride exists and user is passenger
    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only passenger can create payment order'
      });
    }

    if (ride.paymentStatus === 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment already completed for this ride'
      });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${rideId}_${Date.now()}`,
      notes: {
        rideId: rideId,
        userId: req.user._id.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    // Create payment record
    const payment = await Payment.create({
      ride: rideId,
      passenger: req.user._id,
      driver: ride.driver,
      amount,
      razorpayOrderId: order.id,
      status: 'created'
    });

    res.status(201).json({
      success: true,
      order,
      paymentId: payment._id
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment order'
    });
  }
};

// @desc    Verify payment
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      paymentId
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: 'All payment details are required'
      });
    }

    // Find payment record
    const payment = await Payment.findById(paymentId).populate('ride');
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    // Verify payment signature
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (razorpaySignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update payment record
    payment.razorpayPaymentId = razorpayPaymentId;
    payment.razorpaySignature = razorpaySignature;
    payment.status = 'paid';
    payment.paidAt = new Date();

    await payment.save();

    // Update ride payment status
    await Ride.findByIdAndUpdate(payment.ride._id, {
      paymentStatus: 'paid',
      paymentTime: new Date(),
      transactionId: razorpayPaymentId
    });

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      payment
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    });
  }
};

// @desc    Get payment details
// @route   GET /api/payment/:id
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('ride')
      .populate('passenger', 'name email phone')
      .populate('driver', 'name email phone');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Check if user is passenger or driver
    const isPassenger = payment.passenger._id.toString() === req.user._id.toString();
    const isDriver = payment.driver._id.toString() === req.user._id.toString();

    if (!isPassenger && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment details'
    });
  }
};

// @desc    Get payment history
// @route   GET /api/payment/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {
      $or: [
        { passenger: req.user._id },
        { driver: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const payments = await Payment.find(query)
      .populate('ride', 'pickupLocation.address dropLocation.address scheduledTime')
      .populate('passenger', 'name')
      .populate('driver', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Payment.countDocuments(query);

    res.status(200).json({
      success: true,
      payments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history'
    });
  }
};

// @desc    Process refund
// @route   POST /api/payment/:id/refund
// @access  Private
const processRefund = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const payment = await Payment.findById(req.params.id).populate('ride');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Only paid payments can be refunded'
      });
    }

    // Check if user is driver or passenger (admin can also refund)
    const isPassenger = payment.passenger.toString() === req.user._id.toString();
    const isDriver = payment.driver.toString() === req.user._id.toString();

    if (!isPassenger && !isDriver) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Calculate refund amount (80% for demo)
    const refundAmount = payment.amount * 0.8;

    // In production, use Razorpay refund API
    // const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
    //   amount: refundAmount * 100
    // });

    // Update payment record
    payment.status = 'refunded';
    payment.refundAmount = refundAmount;
    payment.refundReason = reason;
    payment.refundedAt = new Date();

    await payment.save();

    // Update ride payment status
    await Ride.findByIdAndUpdate(payment.ride._id, {
      paymentStatus: 'refunded'
    });

    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      refundAmount,
      payment
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing refund'
    });
  }
};

// @desc    Get Razorpay key (for frontend)
// @route   GET /api/payment/key
// @access  Public
const getRazorpayKey = (req, res) => {
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getPaymentDetails,
  getPaymentHistory,
  processRefund,
  getRazorpayKey
};
