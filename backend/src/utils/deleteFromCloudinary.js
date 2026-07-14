import cloudinary from "../config/cloudinary.js";

const deleteFromCloudinary = async (imageUrl) => {
  // Ignore seeded/external images
  if (!imageUrl.includes("res.cloudinary.com")) {
    return;
  }

  const uploadIndex = imageUrl.indexOf("/upload/");

  let publicId = imageUrl.substring(uploadIndex + 8);

  // Remove version if present
  if (publicId.startsWith("v")) {
    publicId = publicId.substring(publicId.indexOf("/") + 1);
  }

  // Remove extension
  publicId = publicId.replace(/\.[^/.]+$/, "");

  await cloudinary.uploader.destroy(publicId);
};

export default deleteFromCloudinary;