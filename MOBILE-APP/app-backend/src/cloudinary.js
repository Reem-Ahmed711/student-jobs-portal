// MOBILE-APP/app-backend/src/cloudinary.js
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "doygckcfu",
  api_key: "216692252521349",
  api_secret: "j-2CqhaTMtDDtcqPc26QsbybB5o",
});

module.exports = cloudinary;
