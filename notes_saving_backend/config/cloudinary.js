// config/cloudinary.js
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // e.g. 'my-cloud'
  api_key: process.env.CLOUDINARY_API_KEY,       // e.g. '123456789'
  api_secret: process.env.CLOUDINARY_API_SECRET, // e.g. 'my-api-secret'
});

module.exports = cloudinary;
