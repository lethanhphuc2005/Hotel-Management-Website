const router = require("express").Router();

const imageController = require("../controllers/image.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ HÌNH ẢNH ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  imageController.getAllImages
);

// === LẤY TẤT CẢ HÌNH ẢNH CHO USER ===
router.get("/user", imageController.getAllImagesForUser);

// === LẤY HÌNH ẢNH THEO ID ===
router.get("/:id", imageController.getImageById);

// === THÊM HÌNH ẢNH ===
router.post("/", authMiddleware.authorizeRoles("admin"), imageController.addImage);

// === CẬP NHẬT HÌNH ẢNH ===
router.put("/:id", authMiddleware.authorizeRoles("admin"), imageController.updateImage);

// === KÍCH HOẠT/VÔ HIỆU HÓA HÌNH ẢNH ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  imageController.toggleImageStatus
);

// // === XÓA HÌNH ẢNH ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin", "receptionist"),
//   imageController.deleteImage
// );

module.exports = router;
