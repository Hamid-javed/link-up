const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'social_media_uploads',
      format: async (req, file) => {
          // Extract the file extension and return it as the format
          const ext = file.mimetype.split('/')[1];
          return ['jpeg', 'png', 'gif', 'bmp', 'tiff'].includes(ext) ? ext : 'jpeg';
      },
      public_id: (req, file) => 'computed-filename-using-request'
  },
});

// File filter to allow only common image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb(new Error('Only image files are allowed!'));
  }
};

// Init upload
exports.upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  }
}).single('image');





