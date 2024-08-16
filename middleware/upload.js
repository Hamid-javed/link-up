const multer = require('multer');
const path = require('path');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinaryConfig');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
      folder: 'social_media_uploads',
      format: async (req, file) => {
          const ext = file.mimetype.split('/')[1];
          return ['jpeg', 'png', "webp", 'bmp', 'tiff'].includes(ext) ? ext : 'jpeg';
      },
      public_id: (req, file) => `${req.id}`
  },
});

const fileFilter = (req, file, cb) => {
try {
  const allowedTypes = /jpeg|jpg|png|webp|bmp|tiff/;
  const mimetype = allowedTypes.test(file.mimetype);
  const extname = allowedTypes.test(file.originalname.toLowerCase().split('.').pop());

  if (mimetype && extname) {
      return cb(null, true);
  } else {
      cb(new Error('Only image files are allowed!'));
  }
} catch (error) {
  console.log(error.message)
  
}
};

exports.upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB limit
  fileFilter: fileFilter
}).single('image'); // Field name should match the form field name





