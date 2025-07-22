const router = require("express").Router();

const bookingStatusController = require("../controllers/bookingStatus.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ TRẠNG THÁI ĐẶT PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingStatusController.getAllBookingStatus
);

// === LẤY TRẠNG THÁI ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingStatusController.getBookingStatusById
);

// === THÊM TRẠNG THÁI ĐẶT PHÒNG MỚI ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  bookingStatusController.addBookingStatus
);

// === CẬP NHẬT TRẠNG THÁI ĐẶT PHÒNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  bookingStatusController.updateBookingStatus
);

// === KÍCH HOẠT / VÔ HIỆU HÓA TRẠNG THÁI ĐẶT PHÒNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  bookingStatusController.toggleBookingStatus
);

// // === XÓA TRẠNG THÁI ĐẶT PHÒNG ===
// router.delete(
//   "/:id",
//   authMiddleware.authorizeRoles("admin"),
//   bookingStatusController.deleteBookingStatus
// );

module.exports = router;
