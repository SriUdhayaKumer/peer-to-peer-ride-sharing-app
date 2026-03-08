const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create subdirectories based on file type
    let subDir = 'others';
    if (file.fieldname === 'idProof') subDir = 'id-proofs';
    if (file.fieldname === 'selfie') subDir = 'selfies';
    if (file.fieldname === 'drivingLicense') subDir = 'licenses';
    if (file.fieldname === 'vehicleRegistration') subDir = 'registrations';
    if (file.fieldname === 'vehiclePhoto') subDir = 'vehicles';
    
    const fullPath = path.join(uploadDir, subDir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, JPG, PNG, GIF) and PDF files are allowed'));
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: fileFilter
});

// Single file upload middleware
const uploadSingle = (fieldName) => upload.single(fieldName);

// Multiple files upload middleware
const uploadMultiple = (fieldNames, maxCount = 5) => upload.array(fieldNames, maxCount);

// Multiple fields upload middleware (more reliable)
const uploadFields = (fields) => upload.fields(fields);

// Helper function to get file URL
const getFileUrl = (filePath) => {
  if (!filePath) return null;
  return `http://localhost:5000/uploads/${path.basename(path.dirname(filePath))}/${path.basename(filePath)}`;
};

// Helper function to delete file
const deleteFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  getFileUrl,
  deleteFile
};
