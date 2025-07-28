const router = require("express").Router();
const roomTypeController = require("../controllers/roomClass.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadRoomClass } = require("../middlewares/cloudinaryUpload.middleware");

// === LẤY TẤT CẢ LOẠI PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomTypeController.getAllRoomClasses
);

// === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
router.get("/user", roomTypeController.getAllRoomClassesForUser);

// === LẤY LOẠI PHÒNG THEO ID ===
router.get("/:id", roomTypeController.getRoomClassById);

// === THÊM LOẠI PHÒNG ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  uploadRoomClass.array("images", 5),
  roomTypeController.addRoomClass
);

// === CẬP NHẬT LOẠI PHÒNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  uploadRoomClass.array("images", 5),
  roomTypeController.updateRoomClass
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  roomTypeController.toggleRoomClassStatus
);

// === XÓA LOẠI PHÒNG ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  roomTypeController.deleteRoomClass
);

module.exports = router;
