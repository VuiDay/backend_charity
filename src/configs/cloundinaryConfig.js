const cloudinary = require('cloudinary').v2
require('dotenv').config()

const cloudName = process.env.CLOUD_NAME
const apiKey = process.env.API_KEYS
const apiSecret = process.env.API_SECRET

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret
});

module.exports = cloudinary