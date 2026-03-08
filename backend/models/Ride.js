const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
  // Basic Information
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false  // Made optional since passenger is assigned later
  },
  
  // Route Information
  pickupLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    landmark: String
  },
  dropLocation: {
    address: {
      type: String,
      required: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: true
      },
      longitude: {
        type: Number,
        required: true
      }
    },
    landmark: String
  },
  
  // Vehicle Information
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car', 'suv', 'van'],
    required: true
  },
  vehicleNumberPlate: {
    type: String,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true,
    min: 1,
    max: 8
  },
  bookedSeats: {
    type: Number,
    default: 1
  },
  
  // Pricing
  baseFare: {
    type: Number,
    required: true
  },
  distanceCost: {
    type: Number,
    required: true
  },
  platformFee: {
    type: Number,
    required: true
  },
  totalFare: {
    type: Number,
    required: true
  },
  fareLocked: {
    type: Boolean,
    default: true
  },
  
  // Distance and Time
  distance: {
    type: Number,
    required: true // in kilometers
  },
  estimatedDuration: {
    type: Number,
    required: true // in minutes
  },
  actualDuration: {
    type: Number // in minutes
  },
  
  // Schedule
  scheduledTime: {
    type: Date,
    required: true
  },
  actualStartTime: {
    type: Date
  },
  actualEndTime: {
    type: Date
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['posted', 'booked', 'confirmed', 'driver_arrived', 'started', 'in_progress', 'completed', 'cancelled'],
    default: 'posted'
  },
  
  // Verification
  qrVerified: {
    type: Boolean,
    default: false
  },
  qrCode: {
    type: String,
    unique: true
  },
  
  // Live Tracking
  driverLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  passengerLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  routePath: [{
    latitude: Number,
    longitude: Number,
    timestamp: Date
  }],
  
  // Payment
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'failed'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'cash'],
    default: 'upi'
  },
  transactionId: String,
  paymentTime: Date,
  
  // Rating and Feedback
  passengerRating: {
    type: Number,
    min: 1,
    max: 5
  },
  driverRating: {
    type: Number,
    min: 1,
    max: 5
  },
  passengerReview: String,
  driverReview: String,
  
  // Emergency
  sosTriggered: {
    type: Boolean,
    default: false
  },
  sosTimestamp: Date,
  sosLocation: {
    latitude: Number,
    longitude: Number
  },
  
  // Cancellation
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancellationReason: String,
  cancellationTime: Date,
  refundAmount: Number,
  
  // Additional Information
  notes: String,
  specialInstructions: String,
  
  // Metadata
  postedAt: {
    type: Date,
    default: Date.now
  },
  bookedAt: Date,
  confirmedAt: Date,
  startedAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Generate unique QR code
rideSchema.pre('save', function(next) {
  if (this.isNew && !this.qrCode) {
    this.qrCode = 'RIDE_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Index for efficient queries
rideSchema.index({ driver: 1, status: 1 });
rideSchema.index({ passenger: 1, status: 1 });
rideSchema.index({ 'pickupLocation.coordinates': '2dsphere' });
rideSchema.index({ 'dropLocation.coordinates': '2dsphere' });
rideSchema.index({ scheduledTime: 1 });
rideSchema.index({ status: 1 });

// Static method to find nearby rides
rideSchema.statics.findNearbyRides = function(pickupCoords, maxDistance = 10) {
  return this.find({
    status: 'posted',
    'pickupLocation.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [pickupCoords.longitude, pickupCoords.latitude]
        },
        $maxDistance: maxDistance * 1000 // Convert km to meters
      }
    },
    scheduledTime: { $gte: new Date() }
  }).populate('driver', 'name rating vehicleNumberPlate vehicleType driverVerified');
};

module.exports = mongoose.model('Ride', rideSchema);
