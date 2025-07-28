const router = require("express").Router();

const DiscountController = require("../controllers/discount.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const {
  uploadDiscount,
} = require("../middlewares/cloudinaryUpload.middleware");

// === LẤY TẤT CẢ KHUYẾN MÃI ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  DiscountController.getAllDiscounts
);

// === LẤY TẤT CẢ KHUYẾN MÃI CHO USER ===
router.get("/user", DiscountController.getAllDiscountsForUser);

// === LẤY KHUYẾN MÃI THEO ID ===
router.get("/:id", DiscountController.getDiscountById);

// === THÊM KHUYẾN MÃI ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  uploadDiscount.single("image"),
  DiscountController.createDiscount
);

// === CẬP NHẬT KHUYẾN MÃI ===
router.patch(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  uploadDiscount.single("image"),
  DiscountController.updateDiscount
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ KHUYẾN MÃI ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  DiscountController.toggleDiscountStatus
);

// // === XÓA KHUYẾN MÃI ===
// router.delete("/:id", authMiddleware.authorizeRoles("admin"), DiscountController.deleteDiscount);

// === XEM TRƯỚC GIÁ PHÒNG VỚI KHUYẾN MÃI ===
router.post(
  "/preview",
  authMiddleware.optionalVerifyToken,
  DiscountController.previewBookingPrice
);

module.exports = router;
