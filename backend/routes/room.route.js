const router = require("express").Router();
const roomController = require("../controllers/room.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer();

// === LẤY DANH SÁCH PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomController.getAllRooms
);

// === LẤY DANH SÁCH PHÒNG THEO THÁNG ===
router.get(
  "/booking-calendar/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomController.getRoomBookingCalendar
);

// === LẤY PHÒNG THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomController.getRoomById
);

// === THÊM PHÒNG ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  upload.none(),
  roomController.addRoom
);

// === CẬP NHẬT THÔNG TIN PHÒNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  upload.none(),
  roomController.updateRoom
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ PHÒNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  roomController.toggleRoomStatus
);

// // === XÓA PHÒNG ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   roomController.deleteRoom
// );

module.exports = router;
