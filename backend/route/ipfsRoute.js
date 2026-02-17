const express = require("express");
const {
  upload,
} = require("../controller/ipfsController");
const { uploadImageOnly } = require("../middleware/multerMiddleware");

const router = express.Router();

router.post("/upload", uploadImageOnly, upload);



module.exports = router;
