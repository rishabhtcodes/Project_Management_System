const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  // use temp dir
});

// Configure multer upload
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
});

module.exports = upload;
