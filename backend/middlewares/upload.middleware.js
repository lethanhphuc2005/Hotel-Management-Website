const multer = require("multer");
const path = require("path");
const fs = require("fs");

// === Tạo folder nếu chưa có ===
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// === Cấu hình lưu trữ cho multer ===
const createUploadFor = (folderName) => {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadPath = path.join(__dirname, "../public/images", folderName);
      ensureDirectoryExists(uploadPath);
      file._customFolder = folderName; // lưu lại folder dùng cho delete

      cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      const name = path.basename(file.originalname, ext);
      cb(null, `${name}-${uniqueSuffix}${ext}`);
    },
  });

  return multer({ storage, fileFilter: checkfile });
};

// === Filter chỉ chấp nhận ảnh ===
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};

const deleteImagesOnError = (files) => {
  files.forEach((file) => {
    if (file && file.filename) {
      const imagePath = path.join(__dirname, "../public/images", file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Không thể xóa ảnh lỗi: ${file.filename}`, err);
        } else {
          console.log(`Đã xóa ảnh lỗi: ${file.filename}`);
        }
      });
    }
  });
};

const deleteOldImages = (relativePaths) => {
  const paths = Array.isArray(relativePaths) ? relativePaths : [relativePaths];
  paths.forEach((relPath) => {
    const fullPath = path.join(__dirname, "../public/images", relPath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("Xoá ảnh cũ lỗi:", relPath, err);
      } else {
        console.log("Đã xoá ảnh cũ:", relPath);
      }
    });
  });
};

// === Export các middleware ===
const uploadMainRoomClass = createUploadFor("main-room-class");
const uploadRoomClass = createUploadFor("room-class");
const uploadService = createUploadFor("service");
const uploadFeature = createUploadFor("feature");
const uploadContent = createUploadFor("content");
const uploadOther = createUploadFor("other");
const uploadDiscount = createUploadFor("discount");

module.exports = {
  deleteImagesOnError,
  deleteOldImages,
  uploadMainRoomClass,
  uploadRoomClass,
  uploadService,
  uploadFeature,
  uploadContent,
  uploadOther,
  uploadDiscount,
};
