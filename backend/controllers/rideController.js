const Ride = require('../models/Ride');
const User = require('../models/User');
const { calculateDistance, estimateRideTime } = require('../utils/fareCalculator');

// @desc    Post a new ride
// @route   POST /api/rides
// @access  Private (Driver verified)
const postRide = async (req, res) => {
  try {
    console.log('Post ride request received:', req.body);
    console.log('User from auth middleware:', req.user);

    const {
      source,  // Changed from pickupLocation
      destination,  // Changed from dropLocation
      vehicleType,
      availableSeats,
      departureDate,  // Changed from scheduledTime
      departureTime,
      farePerSeat  // Changed from baseFare
    } = req.body;

    // Validate driver
    const driver = await User.findById(req.user._id);
    console.log('Driver found:', driver);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    if (!driver.driverVerified) {
      return res.status(403).json({
        success: false,
        message: 'Driver verification required to post rides'
      });
    }

    // Validate required fields
    if (!source || !destination || !departureDate || !departureTime || !farePerSeat) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: source, destination, departureDate, departureTime, farePerSeat'
      });
    }

    // Create pickup and drop location objects
    const pickupLocation = {
      address: source,
      coordinates: { latitude: 0, longitude: 0 } // Default coordinates
    };

    const dropLocation = {
      address: destination,
      coordinates: { latitude: 0, longitude: 0 } // Default coordinates
    };

    // Calculate distance and fare (simplified)
    const distance = 10; // Default 10 km
    const durationMinutes = 30; // Default 30 minutes
    
    // Calculate fare components
    const farePerKm = {
      bike: 8, auto: 12, car: 15, suv: 20, van: 25
    };
    
    const platformFeePercentage = 0.10;
    const distanceCost = distance * farePerKm[vehicleType];
    const platformFee = (parseFloat(farePerSeat) + distanceCost) * platformFeePercentage;
    const totalFare = parseFloat(farePerSeat) + distanceCost + platformFee;

    // Combine date and time
    const scheduledTime = new Date(`${departureDate}T${departureTime}`);

    console.log('Creating ride with data:', {
      driver: req.user._id,
      pickupLocation,
      dropLocation,
      vehicleType,
      vehicleNumberPlate: driver.vehicleNumberPlate || 'UNKNOWN',
      availableSeats: parseInt(availableSeats),
      scheduledTime,
      baseFare: parseFloat(farePerSeat),
      distanceCost,
      platformFee,
      totalFare,
      distance,
      estimatedDuration: durationMinutes,
      status: 'posted'
    });

    const ride = await Ride.create({
      driver: req.user._id,
      pickupLocation,
      dropLocation,
      vehicleType,
      vehicleNumberPlate: driver.vehicleNumberPlate || 'UNKNOWN',
      availableSeats: parseInt(availableSeats),
      scheduledTime,
      baseFare: parseFloat(farePerSeat),
      distanceCost,
      platformFee,
      totalFare,
      distance,
      estimatedDuration: durationMinutes,
      status: 'posted'
    });

    console.log('✅ Ride created successfully in database:', ride._id);
    console.log('📊 Database ride data:', JSON.stringify(ride, null, 2));

    const populatedRide = await Ride.findById(ride._id)
      .populate('driver', 'name rating vehicleNumberPlate vehicleType driverVerified');

    res.status(201).json({
      success: true,
      message: 'Ride posted successfully',
      ride: populatedRide
    });
  } catch (error) {
    console.error('Post ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while posting ride: ' + error.message
    });
  }
};

// @desc    Search for nearby rides
// @route   GET /api/rides/search
// @access  Public
const searchRides = async (req, res) => {
  try {
    const {
      source,
      destination,
      date,
      vehicleType,
      seats,
      maxDistance = 50
    } = req.query;

    console.log('🔍 Search rides query:', req.query);

    // First, let's check if there are any rides at all
    const allPostedRides = await Ride.find({ status: 'posted' });
    console.log(`📊 Total posted rides in database: ${allPostedRides.length}`);
    
    if (allPostedRides.length === 0) {
      console.log('⚠️ No posted rides found in database');
      return res.status(200).json({
        success: true,
        rides: [],
        count: 0,
        message: 'No rides found - please post a ride first'
      });
    }

    // Build base query for posted rides only
    let query = Ride.find({
      status: 'posted'
    });

    // Apply filters
    if (vehicleType && vehicleType !== 'All') {
      query = query.where({ vehicleType: vehicleType.toLowerCase() });
    }
    if (seats) {
      query = query.where({ availableSeats: { $gte: parseInt(seats) } });
    }

    // If date is provided, filter by that date (more flexible)
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      query = query.where({
        scheduledTime: { 
          $gte: searchDate,
          $lt: nextDay
        }
      });
    } else {
      // If no date, show future rides
      query = query.where({
        scheduledTime: { $gte: new Date() }
      });
    }

    // Apply location filters (more flexible - partial matches)
    if (source && source.trim()) {
      query = query.where({
        'pickupLocation.address': { 
          $regex: source.trim(), 
          $options: 'i' 
        }
      });
    }

    if (destination && destination.trim()) {
      query = query.where({
        'dropLocation.address': { 
          $regex: destination.trim(), 
          $options: 'i' 
        }
      });
    }

    const rides = await query
      .populate('driver', 'name rating vehicleNumberPlate vehicleType driverVerified profilePhoto')
      .sort({ scheduledTime: 1 })
      .limit(20);

    console.log(`✅ Found ${rides.length} rides matching criteria`);

    res.status(200).json({
      success: true,
      rides,
      count: rides.length
    });
  } catch (error) {
    console.error('❌ Search rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while searching rides: ' + error.message
    });
  }
};

// @desc    Get ride details
// @route   GET /api/rides/:id
// @access  Public
const getRideDetails = async (req, res) => {
  try {
    console.log('🔍 Getting ride details for ID:', req.params.id);
    
    const ride = await Ride.findById(req.params.id)
      .populate('driver', 'name rating phone vehicleNumberPlate vehicleType driverVerified profilePhoto');

    if (!ride) {
      console.log('❌ Ride not found:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    console.log('✅ Ride details found:', ride._id);
    console.log('📊 Driver data:', ride.driver);

    res.status(200).json({
      success: true,
      ride
    });
  } catch (error) {
    console.error('❌ Get ride details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ride details: ' + error.message
    });
  }
};

// @desc    Book a ride
// @route   POST /api/rides/:id/book
// @access  Private
const bookRide = async (req, res) => {
  try {
    const { seats = 1 } = req.body;

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.status !== 'posted') {
      return res.status(400).json({
        success: false,
        message: 'Ride is no longer available'
      });
    }

    if (ride.availableSeats < seats) {
      return res.status(400).json({
        success: false,
        message: 'Not enough seats available'
      });
    }

    if (ride.driver.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book your own ride'
      });
    }

    // Update ride
    ride.passenger = req.user._id;
    ride.bookedSeats = seats;
    ride.status = 'booked';
    ride.bookedAt = new Date();

    await ride.save();

    const populatedRide = await Ride.findById(ride._id)
      .populate('driver', 'name rating phone vehicleNumberPlate vehicleType driverVerified vehiclePhotoUrl')
      .populate('passenger', 'name phone');

    res.status(200).json({
      success: true,
      message: 'Ride booked successfully',
      ride: populatedRide
    });
  } catch (error) {
    console.error('Book ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while booking ride'
    });
  }
};

// @desc    Confirm ride (by driver)
// @route   POST /api/rides/:id/confirm
// @access  Private
const confirmRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only driver can confirm the ride'
      });
    }

    if (ride.status !== 'booked') {
      return res.status(400).json({
        success: false,
        message: 'Ride cannot be confirmed in current status'
      });
    }

    ride.status = 'confirmed';
    ride.confirmedAt = new Date();

    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride confirmed successfully',
      ride
    });
  } catch (error) {
    console.error('Confirm ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming ride'
    });
  }
};

// @desc    Start ride
// @route   POST /api/rides/:id/start
// @access  Private
const startRide = async (req, res) => {
  try {
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only driver can start the ride'
      });
    }

    if (ride.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'Ride must be confirmed before starting'
      });
    }

    ride.status = 'started';
    ride.actualStartTime = new Date();
    ride.startedAt = new Date();

    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride started successfully',
      ride
    });
  } catch (error) {
    console.error('Start ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while starting ride'
    });
  }
};

// @desc    Complete ride
// @route   POST /api/rides/:id/complete
// @access  Private
const completeRide = async (req, res) => {
  try {
    const { actualDuration } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only driver can complete the ride'
      });
    }

    if (ride.status !== 'started') {
      return res.status(400).json({
        success: false,
        message: 'Ride must be started before completing'
      });
    }

    ride.status = 'completed';
    ride.actualEndTime = new Date();
    ride.completedAt = new Date();
    if (actualDuration) ride.actualDuration = actualDuration;

    await ride.save();

    // Update driver stats
    const driver = await User.findById(ride.driver);
    driver.updateRating(5); // Default rating, will be updated after review
    driver.totalEarnings += ride.totalFare;
    await driver.save();

    res.status(200).json({
      success: true,
      message: 'Ride completed successfully',
      ride
    });
  } catch (error) {
    console.error('Complete ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while completing ride'
    });
  }
};

// @desc    Cancel ride
// @route   POST /api/rides/:id/cancel
// @access  Private
const cancelRide = async (req, res) => {
  try {
    const { reason } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is driver or passenger
    const isDriver = ride.driver.toString() === req.user._id.toString();
    const isPassenger = ride.passenger && ride.passenger.toString() === req.user._id.toString();

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: 'Only driver or passenger can cancel the ride'
      });
    }

    if (['completed', 'cancelled'].includes(ride.status)) {
      return res.status(400).json({
        success: false,
        message: 'Ride cannot be cancelled in current status'
      });
    }

    ride.status = 'cancelled';
    ride.cancelledBy = req.user._id;
    ride.cancellationReason = reason;
    ride.cancellationTime = new Date();
    
    // Calculate refund if applicable
    if (ride.paymentStatus === 'paid') {
      ride.refundAmount = ride.totalFare * 0.8; // 80% refund
    }

    await ride.save();

    // Update user stats
    const user = await User.findById(req.user._id);
    user.cancelledRides += 1;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Ride cancelled successfully',
      ride
    });
  } catch (error) {
    console.error('Cancel ride error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling ride'
    });
  }
};

// @desc    Update driver location (live tracking)
// @route   POST /api/rides/:id/location
// @access  Private
const updateDriverLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only driver can update location'
      });
    }

    // Update driver location
    ride.driverLocation = {
      latitude,
      longitude,
      timestamp: new Date()
    };

    // Add to route path
    ride.routePath.push({
      latitude,
      longitude,
      timestamp: new Date()
    });

    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Location updated successfully',
      location: ride.driverLocation
    });
  } catch (error) {
    console.error('Update location error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating location'
    });
  }
};

// @desc    Trigger SOS emergency
// @route   POST /api/rides/:id/sos
// @access  Private
const triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    // Check if user is driver or passenger
    const isDriver = ride.driver.toString() === req.user._id.toString();
    const isPassenger = ride.passenger && ride.passenger.toString() === req.user._id.toString();

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        success: false,
        message: 'Only driver or passenger can trigger SOS'
      });
    }

    ride.sosTriggered = true;
    ride.sosTimestamp = new Date();
    if (latitude && longitude) {
      ride.sosLocation = { latitude, longitude };
    }

    await ride.save();

    // In production, send emergency notifications here
    console.log(`SOS TRIGGERED: Ride ${ride._id}, User ${req.user._id}, Location: ${latitude}, ${longitude}`);

    res.status(200).json({
      success: true,
      message: 'Emergency alert triggered successfully',
      sosTimestamp: ride.sosTimestamp
    });
  } catch (error) {
    console.error('SOS error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while triggering SOS'
    });
  }
};

// @desc    Verify ride with QR code
// @route   POST /api/rides/:id/verify
// @access  Private
const verifyRideQR = async (req, res) => {
  try {
    const { qrCode } = req.body;
    
    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        success: false,
        message: 'Ride not found'
      });
    }

    if (ride.qrCode !== qrCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid QR code'
      });
    }

    if (ride.qrVerified) {
      return res.status(400).json({
        success: false,
        message: 'Ride already verified'
      });
    }

    // Check if user is passenger
    if (ride.passenger.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only passenger can verify the ride'
      });
    }

    ride.qrVerified = true;

    await ride.save();

    res.status(200).json({
      success: true,
      message: 'Ride verified successfully',
      ride
    });
  } catch (error) {
    console.error('Verify QR error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying ride'
    });
  }
};

// @desc    Get user's ride history
// @route   GET /api/rides/history
// @access  Private
const getRideHistory = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {
      $or: [
        { driver: req.user._id },
        { passenger: req.user._id }
      ]
    };

    if (status) {
      query.status = status;
    }

    const rides = await Ride.find(query)
      .populate('driver', 'name rating vehicleNumberPlate vehicleType')
      .populate('passenger', 'name rating')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Ride.countDocuments(query);

    res.status(200).json({
      success: true,
      rides,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get ride history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching ride history'
    });
  }
};

// @desc    Get user's rides (both posted and booked)
// @route   GET /api/rides/my-rides
// @access  Private
const getMyRides = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get rides where user is driver
    const postedRides = await Ride.find({ driver: userId })
      .populate('driver', 'name rating vehicleNumberPlate vehicleType driverVerified profilePhoto')
      .populate('passenger', 'name phone')
      .sort({ createdAt: -1 });
    
    // Get rides where user is passenger
    const bookedRides = await Ride.find({ passenger: userId })
      .populate('driver', 'name rating vehicleNumberPlate vehicleType driverVerified profilePhoto')
      .populate('passenger', 'name phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      postedRides,
      bookedRides,
      stats: {
        totalPosted: postedRides.length,
        totalBooked: bookedRides.length,
        totalEarnings: postedRides.reduce((sum, ride) => sum + (ride.totalFare || 0), 0),
        totalSpent: bookedRides.reduce((sum, ride) => sum + (ride.totalFare || 0), 0)
      }
    });
  } catch (error) {
    console.error('Get my rides error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching rides: ' + error.message
    });
  }
};

module.exports = {
  postRide,
  searchRides,
  getRideDetails,
  bookRide,
  getMyRides, // Added new function
  confirmRide,
  startRide,
  completeRide,
  cancelRide,
  updateDriverLocation,
  triggerSOS,
  verifyRideQR,
  getRideHistory
};
