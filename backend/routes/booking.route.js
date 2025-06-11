const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");
const middlewareCon = require("../middlewares/auth.middleware");

/// === THÊM MỚI ĐẶT PHÒNG ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingController.addBooking
);

// === LẤY DANH SÁCH ĐẶT PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingController.getAllBookings
);

// === LẤY DANH SÁCH PHÒNG ĐẶT THEO USER ===
router.get(
  "/user/:userId",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.getAllBookingsByUser
);

// === LẤY THÔNG TIN ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.getBookingById
);

// == HỦY BỎ ĐẶT PHÒNG ===
router.put(
  "/cancel/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.cancelBooking
);

// === CẬP NHẬT TRẠNG THÁI ĐẶT PHÒNG ===
router.put(
  "/update-status/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingController.updateBookingStatus
);

// === TÍNH TỔNG TIỀN ĐẶT PHÒNG ===
router.post(
  "/calculate-price/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingController.calculateTotalPrice
);

module.exports = router;
