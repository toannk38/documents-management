const multer = require('../config/multer');

// File type and size validation
const fileFilter = (req, file, cb) => {
  // Accept only pdf, docx, png, jpg, jpeg
  const allowedTypes = /pdf|docx|png|jpg|jpeg/;
  const ext = file.originalname.split('.').pop().toLowerCase();
  if (!allowedTypes.test(ext)) {
    return cb(new Error('Invalid file type'), false);
  }
  cb(null, true);
};

const upload = multer({ 
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit file size to 5MB
}).single('file');

module.exports = (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};
