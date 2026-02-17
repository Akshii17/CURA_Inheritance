require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const { cleanupFiles } = require("../middleware/multerMiddleware");
/**
 * Upload controller
 * - uploads image to IPFS
 * - returns IPFS hash + gateway URL
 */
const upload = async (req, res) => {
  try {
    const image = req.files?.image?.[0];
    
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }

    // Upload image to IPFS
    const imageHash = await uploadToIPFS(
      image.path,
      image.originalname
    );
    cleanupFiles([image.path]);
    return res.status(200).json({
      success: true,
      message: "Upload successful",
      data: {
        imageHash,
      },
    });
  } catch (error) {
    console.error("Upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Upload failed",
      error: error.message,
    });
  }
};

/**
 * Upload file to IPFS via Pinata
 */
const uploadToIPFS = async (filePath, originalName) => {
  const formData = new FormData();

  formData.append("file", fs.createReadStream(filePath));
  formData.append(
    "pinataMetadata",
    JSON.stringify({ name: originalName })
  );
  formData.append(
    "pinataOptions",
    JSON.stringify({ cidVersion: 0 })
  );

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          pinata_api_key: process.env.PINATA_API_KEY,
          pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
        },
        maxBodyLength: "Infinity",
      }
    );

    return response.data.IpfsHash;
  } catch (error) {
    console.error(
      "Error uploading to IPFS:",
      error.response?.data || error.message
    );
    throw new Error("IPFS upload failed");
  }
};

module.exports = { upload };
