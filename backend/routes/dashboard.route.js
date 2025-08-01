const router = require("express").Router();
const {
  getDashboardOverview,
  getBookingStatusStatistics,
  getCancelRateByDate,
} = require("../controllers/dashboard.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TỔNG QUAN DASHBOARD ===
router.get(
  "/overview",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  getDashboardOverview
);

// === THỐNG KÊ TRẠNG THÁI ĐẶT PHÒNG ===
router.get(
  "/statistics/booking-status",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  getBookingStatusStatistics
);

// === THỐNG KÊ TỶ LỆ HUỶ PHÒNG ===
router.get(
  "/statistics/cancellation-rate",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  getCancelRateByDate
);

module.exports = router;
