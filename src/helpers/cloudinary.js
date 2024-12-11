const cloudinary = require("cloudinary").v2;
const fs = require("fs");
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUN_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRECT,
});
const uploadImageCloudinary = async (filePath) => {
  try {
    // Upload an image
    const uploadResult = await cloudinary.uploader
      .upload(filePath)
      .catch((error) => {
        console.log(error);
      });
    if (!uploadResult) {
      console.log("upload failed");
    }

    fs.unlinkSync(filePath);
    return uploadResult;
  } catch (error) {
    console.log("Error from cloudinary image upload funcition", error);
  }
};

module.exports = { uploadImageCloudinary };
