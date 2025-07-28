const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

// === Chỉ chấp nhận ảnh ===
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    const err = new Error("Bạn chỉ được upload file ảnh");
    err.statusCode = 400;
    return cb(err);
  }
  return cb(null, true);
};

// === Tạo uploader theo folder Cloudinary ===
const createUploadFor = (folderName) => {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `the-moon-hotel/${folderName}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1600, height: 1200, crop: "limit" }],
    },
  });

  return multer({ storage, fileFilter: checkfile });
};

// === Hàm xoá ảnh từ Cloudinary ===
const deleteOldImages = async (publicIds) => {
  const ids = Array.isArray(publicIds) ? publicIds : [publicIds];
  for (const publicId of ids) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log("Đã xoá ảnh Cloudinary:", result);
    } catch (err) {
      console.error("Lỗi xoá ảnh:", publicId, err);
    }
  }
};

// === Xoá ảnh nếu có lỗi xảy ra ===
const deleteImagesOnError = async (files) => {
  for (const file of files) {
    if (file && file.filename) {
      try {
        await cloudinary.uploader.destroy(file.filename);
        console.log(`Đã xoá ảnh lỗi: ${file.filename}`);
      } catch (err) {
        console.error(`Không thể xoá ảnh lỗi: ${file.filename}`, err);
      }
    }
  }
};

// === Export các uploader theo loại ===
const uploadMainRoomClass = createUploadFor("main-room-class");
const uploadRoomClass = createUploadFor("room-class");
const uploadService = createUploadFor("service");
const uploadFeature = createUploadFor("feature");
const uploadContent = createUploadFor("content");
const uploadOther = createUploadFor("other");
const uploadDiscount = createUploadFor("discount");

module.exports = {
  uploadMainRoomClass,
  uploadRoomClass,
  uploadService,
  uploadFeature,
  uploadContent,
  uploadOther,
  uploadDiscount,
  deleteImagesOnError,
  deleteOldImages,
};
