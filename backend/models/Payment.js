const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // References
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  
  // Razorpay Details
  razorpayOrderId: {
    type: String,
    required: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['created', 'paid', 'failed', 'refunded', 'partially_refunded'],
    default: 'created'
  },
  
  // Payment Method
  method: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'netbanking'],
    required: true
  },
  
  // Breakdown
  baseFare: Number,
  distanceCost: Number,
  platformFee: Number,
  gst: Number,
  discount: Number,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: Date,
  refundedAt: Date,
  
  // Refund Details
  refundAmount: Number,
  refundReason: String,
  
  // Metadata
  ip: String,
  userAgent: String
}, {
  timestamps: true
});

// Index for efficient queries
paymentSchema.index({ ride: 1 });
paymentSchema.index({ passenger: 1 });
paymentSchema.index({ driver: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ razorpayOrderId: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
