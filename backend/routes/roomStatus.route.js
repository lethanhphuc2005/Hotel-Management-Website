const router = require("express").Router();

const roomStatusController = require("../controllers/roomStatus.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ TRẠNG THÁI PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomStatusController.getAllRoomStatus
);

// === LẤY TRẠNG THÁI PHÒNG THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomStatusController.getRoomStatusById
);

// === THÊM TRẠNG THÁI PHÒNG MỚI ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  roomStatusController.addRoomStatus
);

// === CẬP NHẬT TRẠNG THÁI PHÒNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  roomStatusController.updateRoomStatus
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ TRẠNG THÁI PHÒNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  roomStatusController.toggleRoomStatus
);

// // === XÓA TRẠNG THÁI PHÒNG ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   roomStatusController.deleteRoomStatus
// );

module.exports = router;
