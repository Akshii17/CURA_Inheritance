// middleware/multerMiddleware.js
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Use a subfolder inside OS temp dir so it's obvious in logs
const TMP_ROOT = path.join(os.tmpdir(), "7tracks-uploads");

// Ensure tmp folder exists
try {
  fs.mkdirSync(TMP_ROOT, { recursive: true });
} catch (e) {
  console.warn("Could not create tmp dir:", e.message);
}

// Disk storage writing into /tmp (writable in serverless)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      // create again to be safe
      fs.mkdirSync(TMP_ROOT, { recursive: true });
      cb(null, TMP_ROOT);
    } catch (err) {
      cb(err);
    }
  },
  filename: (req, file, cb) => {
    const safeName = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 150 * 1024 * 1024, // 150 MB max (adjust if needed)
  },
});

// Robust cleanup that accepts absolute or relative paths
const cleanupFiles = (paths) => {
  paths.forEach((filePath) => {
    try {
      // If path is relative, assume it was created in TMP_ROOT
      let absolutePath = filePath;
      if (!path.isAbsolute(filePath)) {
        absolutePath = path.resolve(TMP_ROOT, filePath);
      }
      // If it's already an absolute path but not inside TMP_ROOT, we still attempt deletion
      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log("🧹 Deleted temp file:", absolutePath);
      } else {
        console.log("⚠️ File not found for deletion:", absolutePath);
      }
    } catch (err) {
      console.warn("⚠️ Failed to delete file:", filePath, err.message);
    }
  });
};


const uploadImageOnly = upload.fields([
  { name: 'image', maxCount: 1 },

]);


module.exports = {
  uploadImageOnly,
  cleanupFiles,
  TMP_ROOT, // export for debugging or other helpers
};