const router = require("express").Router();
const bookingCon = require("../controllers/bookingCon");
const middlewareCon = require("../middlewares/middlewareCon");

/// === THÊM MỚI ĐẶT PHÒNG ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingCon.addBooking
);

// === LẤY DANH SÁCH ĐẶT PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingCon.getAllBookings
);

// === LẤY DANH SÁCH PHÒNG ĐẶT THEO USER ===
router.get(
  "/user/:userId",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingCon.getAllBookingsByUser
);

// === LẤY THÔNG TIN ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingCon.getBookingById
);

// == HỦY BỎ ĐẶT PHÒNG ===
router.put(
  "/cancel/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  bookingCon.cancelBooking
);

// === CẬP NHẬT TRẠNG THÁI ĐẶT PHÒNG ===
router.put(
  "/update-status/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingCon.updateBookingStatus
);

// === TÍNH TỔNG TIỀN ĐẶT PHÒNG ===
router.post(
  "/calculate-price/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingCon.calculateTotalPrice
);

module.exports = router;
