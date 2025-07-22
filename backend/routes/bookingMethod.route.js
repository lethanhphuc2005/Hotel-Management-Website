const router = require("express").Router();
const bookingMethodController = require("../controllers/bookingMethod.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ PHƯƠNG THỨC ĐẶT PHÒNG ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingMethodController.getAllBookingMethods
);

// === LẤY PHƯƠNG THỨC ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  bookingMethodController.getBookingMethodById
);

// === THÊM PHƯƠNG THỨC ĐẶT PHÒNG ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  bookingMethodController.addBookingMethod
);

// === BẬT/TẮT PHƯƠNG THỨC ĐẶT PHÒNG ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  bookingMethodController.toggleBookingMethodStatus
);

// === CẬP NHẬT PHƯƠNG THỨC ĐẶT PHÒNG ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  bookingMethodController.updateBookingMethod
);

// === XÓA PHƯƠNG THỨC ĐẶT PHÒNG ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  bookingMethodController.deleteBookingMethod
);

module.exports = router;
