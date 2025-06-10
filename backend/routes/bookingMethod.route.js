const router = require("express").Router();
const bookingMethodCon = require("../controllers/bookingMethod.controller");
const middlewareCon = require("../middlewares/middleware.controller");

// === LẤY TẤT CẢ PHƯƠNG THỨC ĐẶT PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingMethodCon.getAllBookingMethods
);

// === LẤY PHƯƠNG THỨC ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingMethodCon.getBookingMethodById
);

// === THÊM PHƯƠNG THỨC ĐẶT PHÒNG ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  bookingMethodCon.addBookingMethod
);

// === CẬP NHẬT PHƯƠNG THỨC ĐẶT PHÒNG ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  bookingMethodCon.updateBookingMethod
);

// === XÓA PHƯƠNG THỨC ĐẶT PHÒNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  bookingMethodCon.deleteBookingMethod
);

module.exports = router;
