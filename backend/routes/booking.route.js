const router = require("express").Router();
const bookingController = require("../controllers/booking.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/// === THÊM MỚI ĐẶT PHÒNG ===
router.post("/", bookingController.addBooking);

// === LẤY DANH SÁCH ĐẶT PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingController.getAllBookings
);

// === LẤY DANH SÁCH PHÒNG ĐẶT THEO USER ===
router.get(
  "/user/:userId",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.getAllBookingsByUser
);

// === LẤY THÔNG TIN ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeBookingOwnerOrRoles("admin", "receptionist"),
  bookingController.getBookingById
);

// === XEM PHÍ HỦY BỎ ĐẶT PHÒNG ===
router.get(
  "/cancellation-fee/:id",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.previewCancellationFee
);

// == HỦY BỎ ĐẶT PHÒNG ===
router.patch(
  "/cancel/:id",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  bookingController.cancelBooking
);

// === XÁC NHẬN ĐẶT PHÒNG ===
router.patch(
  "/confirm/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingController.confirmBooking
);

// === CHECK IN ĐẶT PHÒNG ===
router.patch(
  "/check-in/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingController.checkInBooking
);

// === CHECK OUT ĐẶT PHÒNG ===
router.patch(
  "/check-out/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingController.checkOutBooking
);

// === TÍNH TỔNG TIỀN ĐẶT PHÒNG ===
router.post(
  "/calculate-price/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingController.calculateTotalPrice
);

module.exports = router;
