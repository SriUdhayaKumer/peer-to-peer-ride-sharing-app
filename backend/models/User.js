const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^\d{10}$/, 'Phone number must be 10 digits']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  role: {
    type: String,
    enum: ['passenger', 'driver', 'both'],
    default: 'passenger'
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  
  // Identity Verification
  identityVerified: {
    type: Boolean,
    default: false
  },
  idProofType: {
    type: String,
    enum: ['aadhar', 'driving_license', 'passport']
  },
  idProofUrl: {
    type: String
  },
  selfieUrl: {
    type: String
  },
  
  // Driver Verification
  driverVerified: {
    type: Boolean,
    default: false
  },
  drivingLicenseUrl: {
    type: String
  },
  vehicleRegistrationUrl: {
    type: String
  },
  vehiclePhotoUrl: {
    type: String
  },
  vehicleNumberPlate: {
    type: String,
    uppercase: true
  },
  vehicleType: {
    type: String,
    enum: ['bike', 'auto', 'car', 'suv', 'van']
  },
  availableSeats: {
    type: Number,
    min: 1,
    max: 8
  },
  
  // Ratings and Stats
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  totalRides: {
    type: Number,
    default: 0
  },
  completedRides: {
    type: Number,
    default: 0
  },
  cancelledRides: {
    type: Number,
    default: 0
  },
  
  // Earnings (for drivers)
  totalEarnings: {
    type: Number,
    default: 0
  },
  
  // Emergency Contacts
  emergencyContacts: [{
    name: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    relation: {
      type: String,
      enum: ['Parent', 'Spouse', 'Sibling', 'Friend', 'Relative'],
      default: 'Friend'
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Location
  lastLocation: {
    latitude: Number,
    longitude: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  
  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  
  // OTP for login
  otp: {
    code: String,
    expiresAt: Date,
    attempts: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate OTP method
userSchema.methods.generateOTP = function() {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    attempts: 0
  };
  return otp;
};

// Verify OTP method
userSchema.methods.verifyOTP = function(candidateOTP) {
  if (!this.otp || !this.otp.code) return false;
  
  if (this.otp.attempts >= 3) {
    this.otp = undefined;
    return false;
  }
  
  if (Date.now() > this.otp.expiresAt) {
    this.otp = undefined;
    return false;
  }
  
  if (this.otp.code === candidateOTP) {
    this.otp = undefined;
    return true;
  }
  
  this.otp.attempts += 1;
  return false;
};

// Update rating method
userSchema.methods.updateRating = function(newRating) {
  // Simple average rating calculation
  this.rating = (this.rating + newRating) / 2;
  this.totalRides += 1;
  this.completedRides += 1;
};

module.exports = mongoose.model('User', userSchema);
