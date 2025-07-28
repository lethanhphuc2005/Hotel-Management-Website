const router = require("express").Router();
const featureController = require("../controllers/feature.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadFeature } = require("../middlewares/cloudinaryUpload.middleware");

// === LẤY TẤT CẢ TIỆN NGHI ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  featureController.getAllFeatures
);

// === LẤY TẤT CẢ TIỆN NGHI CHO USER ===
router.get("/user", featureController.getAllFeaturesForUser);

// === LẤY TIỆN NGHI THEO ID ===
router.get("/:id", featureController.getFeatureById);

// === THÊM TIỆN NGHI ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  uploadFeature.single("image"),
  featureController.addFeature
);

// === CẬP NHẬT TIỆN NGHI ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  uploadFeature.single("image"),
  featureController.updateFeature
);

// === KÍCH HOẠT/VÔ HIỆU HÓA TIỆN NGHI ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  featureController.toggleFeatureStatus
);

// // === XÓA TIỆN NGHI ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   featureController.deleteFeature
// );

module.exports = router;
