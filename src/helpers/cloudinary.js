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

const deleteCloudinaryImage = async (cloudinaryPath = "") => {
  try {
    const deletefile = await cloudinary.api.delete_resources(
      ["y0jo5bm65uvxedrd7bix"],
      {
        type: "upload",
        resource_type: "image",
      }
    );

    return deletefile;
  } catch (error) {
    console.log("Error from cloudinary image deleted funcition", error);
  }
};

module.exports = { uploadImageCloudinary, deleteCloudinaryImage };
