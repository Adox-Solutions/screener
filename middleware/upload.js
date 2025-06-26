const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Generate a unique filename: timestamp + random + originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const filename = `${base}-${uniqueSuffix}${ext}`;
    cb(null, filename);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  const base = path.basename(file.originalname, ext);
  // Check if any file in uploads starts with the same base name
  const files = fs.readdirSync('uploads/');
  const exists = files.some(f => f.startsWith(base + '-'));
  if (exists) {
    return cb(new Error('A file with this base name already exists. Please use a different name.'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload; 