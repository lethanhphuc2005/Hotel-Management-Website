const router = require("express").Router();

const discountController = require("../controllers/discount.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ KHUYẾN MÃI ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  discountController.getAllDiscounts
);

// === LẤY TẤT CẢ KHUYẾN MÃI CHO USER ===
router.get("/user", discountController.getAllDiscountsForUser);

// === LẤY KHUYẾN MÃI THEO ID ===
router.get("/:id", discountController.getDiscountById);

// === THÊM KHUYẾN MÃI ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  discountController.addDiscount
);

// === CẬP NHẬT KHUYẾN MÃI ===
router.put(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  discountController.updateDiscount
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ KHUYẾN MÃI ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  discountController.toggleDiscountStatus
);

// // === XÓA KHUYẾN MÃI ===
// router.delete("/:id", authMiddleware.authorizeRoles("admin"), discountController.deleteDiscount);

module.exports = router;
