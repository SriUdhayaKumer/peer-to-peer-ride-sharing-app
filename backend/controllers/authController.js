const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { uploadSingle, getFileUrl } = require('../middleware/upload');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Register user (Step 1 - Basic Info)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email or phone already exists'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      phone,
      password
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user with email/password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Send OTP for phone verification
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || !/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Valid 10-digit phone number is required'
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User with this phone number not found'
      });
    }

    // Generate OTP
    const otp = user.generateOTP();
    await user.save();

    // In production, send SMS via Twilio or similar service
    // For now, just return the OTP (for development)
    console.log(`OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      // In production, remove this line
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending OTP'
    });
  }
};

// @desc    Verify OTP and login
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and OTP are required'
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying OTP'
    });
  }
};

// @desc    Complete identity verification (Step 2)
// @route   POST /api/auth/verify-identity
// @access  Private
const verifyIdentity = async (req, res) => {
  try {
    const { idProofType } = req.body;
    
    // Handle files from upload.fields() middleware
    const profilePhotoFile = req.files?.profilePhoto?.[0];
    const idProofFile = req.files?.idProof?.[0];
    const selfieFile = req.files?.selfie?.[0];

    console.log('Files received:', { 
      profilePhotoFile: !!profilePhotoFile,
      idProofFile: !!idProofFile, 
      selfieFile: !!selfieFile,
      reqFiles: req.files
    });

    // At least one document is required for identity verification
    if (!profilePhotoFile && !idProofFile && !selfieFile) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one document for identity verification'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user with verification documents
    if (profilePhotoFile) {
      user.profilePhoto = getFileUrl(profilePhotoFile.path);
    }
    if (idProofFile) {
      user.idProofType = idProofType || 'aadhar';
      user.idProofUrl = getFileUrl(idProofFile.path);
    }
    if (selfieFile) {
      user.selfieUrl = getFileUrl(selfieFile.path);
    }
    
    // Mark as identity verified if at least ID proof or selfie is uploaded
    if (idProofFile || selfieFile) {
      user.identityVerified = true;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Identity verification completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified,
        profilePhoto: user.profilePhoto
      }
    });
  } catch (error) {
    console.error('Verify identity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying identity'
    });
  }
};

// @desc    Complete driver verification (Step 3 - Optional)
// @route   POST /api/auth/verify-driver
// @access  Private
const verifyDriver = async (req, res) => {
  try {
    const {
      vehicleType,
      vehicleNumberPlate,
      availableSeats
    } = req.body;

    // Handle files from upload.fields() middleware
    const drivingLicenseFile = req.files?.drivingLicense?.[0];
    const vehicleRegistrationFile = req.files?.vehicleRegistration?.[0];
    const vehiclePhotoFile = req.files?.vehiclePhoto?.[0];

    console.log('Driver files received:', { 
      drivingLicenseFile: !!drivingLicenseFile, 
      vehicleRegistrationFile: !!vehicleRegistrationFile, 
      vehiclePhotoFile: !!vehiclePhotoFile,
      allFiles: req.files
    });

    if (!vehicleType || !vehicleNumberPlate || !availableSeats ||
        !drivingLicenseFile || !vehicleRegistrationFile || !vehiclePhotoFile) {
      return res.status(400).json({
        success: false,
        message: 'All driver verification fields and documents are required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user with driver verification
    user.vehicleType = vehicleType;
    user.vehicleNumberPlate = vehicleNumberPlate.toUpperCase();
    user.availableSeats = availableSeats;
    user.drivingLicenseUrl = getFileUrl(drivingLicenseFile.path);
    user.vehicleRegistrationUrl = getFileUrl(vehicleRegistrationFile.path);
    user.vehiclePhotoUrl = getFileUrl(vehiclePhotoFile.path);
    user.driverVerified = true; // Auto-verify for demo
    user.role = user.role === 'passenger' ? 'both' : 'driver';

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Driver verification completed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified,
        profilePhoto: user.profilePhoto,
        vehicleType: user.vehicleType,
        vehicleNumberPlate: user.vehicleNumberPlate,
        availableSeats: user.availableSeats
      }
    });
  } catch (error) {
    console.error('Driver verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during driver verification'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profilePhoto: user.profilePhoto,
        identityVerified: user.identityVerified,
        driverVerified: user.driverVerified,
        vehicleType: user.vehicleType,
        vehicleNumberPlate: user.vehicleNumberPlate,
        availableSeats: user.availableSeats,
        rating: user.rating,
        totalRides: user.totalRides,
        completedRides: user.completedRides,
        totalEarnings: user.totalEarnings,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, email, emergencyContact } = req.body;
    
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (emergencyContact) user.emergencyContact = emergencyContact;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        emergencyContact: user.emergencyContact
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

// @desc    Update profile photo
// @route   POST /api/auth/update-profile-photo
// @access  Private
const updateProfilePhoto = async (req, res) => {
  try {
    const profilePhotoFile = req.file;

    if (!profilePhotoFile) {
      return res.status(400).json({
        success: false,
        message: 'Profile photo is required'
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update user with profile photo
    user.profilePhoto = getFileUrl(profilePhotoFile.path);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile photo updated successfully',
      profilePhoto: user.profilePhoto
    });
  } catch (error) {
    console.error('Update profile photo error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile photo'
    });
  }
};

module.exports = {
  register,
  login,
  sendOTP,
  verifyOTP,
  verifyIdentity,
  verifyDriver,
  getMe,
  updateProfile,
  updateProfilePhoto
};
