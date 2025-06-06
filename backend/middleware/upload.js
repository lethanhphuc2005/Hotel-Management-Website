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
const deleteSingleImage = (filename) => {
  if (!filename) return;

  const imagePath = path.join(__dirname, "../public/images", filename);
  fs.unlink(imagePath, (err) => {
    if (err) console.error("Không thể xóa file ảnh:", err);
  });
};

// Xoá nhiều file từ req.files hoặc mảng tên file
const deleteImagesOnError = (files) => {
  if (!files) return;

  // Nếu là mảng req.files (mỗi phần tử có .filename)
  if (Array.isArray(files)) {
    files.forEach((file) => {
      deleteSingleImage(file.filename);
    });
  }

  // Nếu là object { fieldName: [{filename}, ...] }, dùng cho upload.fields()
  else if (typeof files === "object") {
    Object.values(files).forEach((fileArray) => {
      fileArray.forEach((file) => deleteSingleImage(file.filename));
    });
  }
};

// === XÓA ẢNH CŨ KHI CẬP NHẬT ===
const deleteOldImage = (imagePaths) => {
  if (!imagePaths) return;

  // Nếu chỉ là một string, chuyển thành mảng 1 phần tử
  const paths = Array.isArray(imagePaths) ? imagePaths : [imagePaths];

  paths.forEach((oldImagePath) => {
    if (typeof oldImagePath !== "string") return;

    const cleanedPath = oldImagePath.startsWith("/")
      ? oldImagePath.slice(1)
      : oldImagePath;

    const fullPath = path.join(__dirname, "../public", cleanedPath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error("❌ Không thể xóa ảnh:", fullPath, err.message);
      } else {
        console.log("🗑️ Đã xóa ảnh:", fullPath);
      }
    });
  });
};

module.exports = { upload, deleteImagesOnError, deleteOldImage };
