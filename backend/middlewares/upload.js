//chèn multer để upload file
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${uniqueSuffix}${ext}`);
  },
});
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: checkfile });

// === XOÁ ẢNH KHI LỖI ===
const deleteImagesOnError = (filePaths) => {
  const files = Array.isArray(filePaths) ? filePaths : [filePaths];

  files.forEach((file) => {
    if (file && file.filename) {
      const imagePath = path.join(__dirname, "../public/images", file.filename);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Không thể xóa file ảnh ${file.filename}:`, err);
        }
      });
    }
  });
};

// === XÓA ẢNH CŨ KHI CẬP NHẬT ===
const deleteOldImages = (inputPaths) => {
  const paths = Array.isArray(inputPaths) ? inputPaths : [inputPaths];

  paths.forEach((oldImagePath) => {
    if (oldImagePath) {
      const imagePath = path.join(__dirname, "../public/images", oldImagePath);
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error(`Không thể xóa file ảnh: ${oldImagePath}`, err);
        }
      });
    }
  });
  console.log("Đã xóa ảnh cũ thành công trên server:", paths);
};

module.exports = {
  upload,
  deleteImagesOnError,
  deleteOldImages,
};
