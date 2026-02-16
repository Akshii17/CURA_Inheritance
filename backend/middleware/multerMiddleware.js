// middleware/fileUpload.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Disk storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

// Create a Multer instance with storage
const upload = multer({ storage });

// Utility: cleanup files
const cleanupFiles = (paths) => {
  paths.forEach(filePath => {
    const absolutePath = path.resolve(filePath);  // 👈 Convert to absolute path
    console.log(`🛣️ Attempting to delete: ${absolutePath}`);
    fs.unlink(absolutePath, err => {
      if (err) console.error(`❌ Failed to delete ${absolutePath}:`, err);
      else console.log(`🧹 Deleted temp file: ${absolutePath}`);
    });
  });
};



const uploadImageOnly = upload.fields([
  { name: 'image', maxCount: 1 },
]);

module.exports = {
  uploadImageOnly,
  cleanupFiles,
};