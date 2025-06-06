const router = require("express").Router();

const imageCon = require("../controllers/imageCon");
const middlewareCon = require("../middlewares/middlewareCon");

// === LẤY TẤT CẢ HÌNH ẢNH ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  imageCon.getAllImages
);

// === LẤY TẤT CẢ HÌNH ẢNH CHO USER ===
router.get("/user", imageCon.getAllImagesForUser);

// === LẤY HÌNH ẢNH THEO ID ===
router.get("/:id", imageCon.getImageById);

// === THÊM HÌNH ẢNH ===
router.post("/", middlewareCon.authorizeRoles("admin"), imageCon.addImage);

// === CẬP NHẬT HÌNH ẢNH ===
router.put("/:id", middlewareCon.authorizeRoles("admin"), imageCon.updateImage);

// === KÍCH HOẠT/VÔ HIỆU HÓA HÌNH ẢNH ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  imageCon.toggleImageStatus
);

// // === XÓA HÌNH ẢNH ===
// router.delete(
//   "/:id",
//   middlewareCon.authorizeRoles("admin", "receptionist"),
//   imageCon.deleteImage
// );

module.exports = router;
