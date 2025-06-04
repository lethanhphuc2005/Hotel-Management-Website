const router = require("express").Router();

const bookingStatusCon = require("../controllers/bookingStatusCon");
const middlewareCon = require("../controllers/middlewareCon");

// === LẤY TẤT CẢ TRẠNG THÁI ĐẶT PHÒNG ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingStatusCon.getAllBookingStatus
);

// === LẤY TRẠNG THÁI ĐẶT PHÒNG THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  bookingStatusCon.getBookingStatusById
);

// === THÊM TRẠNG THÁI ĐẶT PHÒNG MỚI ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  bookingStatusCon.addBookingStatus
);

// === CẬP NHẬT TRẠNG THÁI ĐẶT PHÒNG ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  bookingStatusCon.updateBookingStatus
);

// === XÓA TRẠNG THÁI ĐẶT PHÒNG ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  bookingStatusCon.deleteBookingStatus
);

module.exports = router;
