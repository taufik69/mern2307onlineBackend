const { ApiResponse } = require("../Utils/Apiresponse");
const { apiError } = require("../Utils/ApiErrorResponse");
const bannerModel = require("../Model/banner.model");
const { uploadImageCloudinary } = require("../helpers/cloudinary");

// create banner controller
const createbanner = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res
        .status(401)
        .json(new apiError(false, `Banner title missing!!`, 401, null));
    }
    if (!req.files) {
      return res
        .status(401)
        .json(new apiError(false, `Banner image missing!!`, 401, null));
    }
    const isAlreadyExist = await bannerModel.find({ title: title });
    if (isAlreadyExist?.length) {
      return res
        .status(401)
        .json(new apiError(false, "Already Exist in this Banner", 401, null));
    }

    // now save the banner information into database

    const { secure_url } = await uploadImageCloudinary(
      req.files?.image[0]?.path
    );
    // save the banner information into database
    const banner = await new bannerModel({
      title: title,
      image: secure_url,
    }).save();
    console.log(banner);

    if (!banner) {
      return res
        .status(401)
        .json(new apiError(false, "Banner not upload", 401, null));
    }
    return res
      .status(200)
      .json(new ApiResponse(true, "Banner upload successfully", 200, banner));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          false,
          `Error from create banner   controller  ${error}`,
          501,
          null
        )
      );
  }
};

// get all banner
const getAllBanner = async (req, res) => {
  try {
    const banners = await bannerModel.find();
    if (!banners) {
      return res
        .status(401)
        .json(new apiError(false, "Banner not found", 401, null));
    }

    bannerModel.findOneAndUpdate(
      { _id: "123fsa23" },
      { title: "mern", image: "http" },
      { new: true }
    );
    return res
      .status(200)
      .json(new ApiResponse(true, "Banner found", 200, banners));
  } catch (error) {
    return res
      .status(500)
      .json(
        new apiError(
          false,
          `Error from get all banner   controller  ${error}`,
          501,
          null
        )
      );
  }
};
module.exports = { createbanner, getAllBanner };
