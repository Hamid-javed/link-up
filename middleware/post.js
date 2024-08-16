const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig'); // Adjust path accordingly
const { v4: uuidv4 } = require("uuid")


// Configure Cloudinary Storage for media uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const uniqueSuffix = `${Date.now()}-${uuidv4()}`;
    const filename = file.originalname.replace(/\.[^/.]+$/, "");
    const folder = 'post_media';
    let format = 'auto';
    if (file.mimetype.startsWith('image/')) {
      format = file.mimetype.split('/')[1];
    } else if (file.mimetype.startsWith('video/')) {
      format = 'mp4'; // Use a common format for videos
    } else if (file.mimetype.startsWith('image/gif')) {
      format = 'gif';
    }

    return {
      folder,
      format,
      public_id: `${filename}-${uniqueSuffix}`
    };
  }
});

// File filter to handle different media types
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|bmp|tiff|gif|mp4/; // Add more types if needed
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype) {
    return cb(null, true);
  } else {
    return cb(new Error('Only image, video, and GIF files are allowed!'));
  }
};

// Middleware for handling post media uploads
exports.post = multer({
  storage,
  limits: { fileSize: 5000000 }, // 5MB limit (adjust as needed)
  fileFilter: fileFilter
}).single('post'); // Field name should match the form field name
