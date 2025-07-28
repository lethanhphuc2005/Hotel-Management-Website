const router = require("express").Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadService } = require("../middlewares/cloudinaryUpload.middleware");

// === LẤY DANH SÁCH DỊCH VỤ ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  serviceController.getAllServices
);

// === LẤY DANH SÁCH DỊCH VỤ CHO USER ===
router.get("/user", serviceController.getAllServicesForUser);

// === LẤY DỊCH VỤ THEO ID ===
router.get("/:id", serviceController.getServiceById);

// === THÊM DỊCH VỤ ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  uploadService.single("image"),
  serviceController.addService
);

// === CẬP NHẬT DỊCH VỤ ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  uploadService.single("image"),
  serviceController.updateService
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ DỊCH VỤ ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  serviceController.toggleServiceStatus
);

// // === XÓA DỊCH VỤ ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   serviceController.deleteService
// );

module.exports = router;
