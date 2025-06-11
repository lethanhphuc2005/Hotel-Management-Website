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

// === CẬP NHẬT PHƯƠNG THỨC ĐẶT PHÒNG ===
router.put(
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
