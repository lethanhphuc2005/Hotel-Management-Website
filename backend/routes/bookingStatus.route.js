const router = require("express").Router();

const bookingStatusCon = require("../controllers/bookingStatus.controller");
const middlewareCon = require("../middlewares/auth.middleware");

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

// === KÍCH HOẠT / VÔ HIỆU HÓA TRẠNG THÁI ĐẶT PHÒNG ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  bookingStatusCon.toggleBookingStatus
);

// // === XÓA TRẠNG THÁI ĐẶT PHÒNG ===
// router.delete(
//   "/:id",
//   middlewareCon.authorizeRoles("admin"),
//   bookingStatusCon.deleteBookingStatus
// );

module.exports = router;
