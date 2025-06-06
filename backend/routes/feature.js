const router = require("express").Router();
const featureCon = require("../controllers/featureCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ TIỆN NGHI ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  featureCon.getAllFeatures
);

// === LẤY TẤT CẢ TIỆN NGHI CHO USER ===
router.get("/user", featureCon.getAllFeaturesForUser);

// === LẤY TIỆN NGHI THEO ID ===
router.get("/:id", featureCon.getFeatureById);

// === THÊM TIỆN NGHI ===
router.post("/", middlewareCon.authorizeRoles("admin"), featureCon.addFeature);

// === CẬP NHẬT TIỆN NGHI ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  featureCon.updateFeature
);

// === KÍCH HOẠT/VÔ HIỆU HÓA TIỆN NGHI ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  featureCon.toggleFeatureStatus
);

// // === XÓA TIỆN NGHI ===
// router.delete(
//   "/:id",
//   middlewareCon.authorizeRoles("admin"),
//   featureCon.deleteFeature
// );

module.exports = router;
