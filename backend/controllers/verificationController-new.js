const User = require('../models/User');

const getVerificationStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const verificationScore = (user.profilePhoto ? 25 : 0) + 
                            (user.identityVerified ? 35 : 0) + 
                            (user.driverVerified ? 40 : 0);

    let status = 'Not Started';
    if (verificationScore >= 100) status = 'Fully Verified';
    else if (verificationScore >= 75) status = 'Almost Complete';
    else if (verificationScore >= 50) status = 'In Progress';
    else if (verificationScore > 0) status = 'Started';

    res.status(200).json({
      success: true,
      verificationStatus: {
        status,
        score: verificationScore,
        identityVerified: !!user.identityVerified,
        driverVerified: !!user.driverVerified,
        profilePhoto: !!user.profilePhoto
      }
    });

  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const recommendations = [];
    
    if (!user.identityVerified) {
      recommendations.push({
        type: 'safety',
        priority: 'high',
        title: 'Complete Identity Verification',
        description: 'Verify your government ID to unlock all safety features.',
        action: 'Go to Profile'
      });
    }

    if (!user.profilePhoto) {
      recommendations.push({
        type: 'trust',
        priority: 'medium',
        title: 'Add Profile Photo',
        description: 'Add a photo to increase trust and get more rides.',
        action: 'Upload Photo'
      });
    }

    res.status(200).json({
      success: true,
      recommendations
    });

  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  getVerificationStatus,
  getRecommendations
};
