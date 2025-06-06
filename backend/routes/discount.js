const router = require("express").Router();

const discountCon = require("../controllers/discountCon");
const middlewareCon = require("../middlewares/middlewareCon");

// === LẤY TẤT CẢ KHUYẾN MÃI ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin"),
  discountCon.getAllDiscounts
);

// === LẤY TẤT CẢ KHUYẾN MÃI CHO USER ===
router.get("/user", discountCon.getAllDiscountsForUser);

// === LẤY KHUYẾN MÃI THEO ID ===
router.get("/:id", discountCon.getDiscountById);

// === THÊM KHUYẾN MÃI ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  discountCon.addDiscount
);

// === CẬP NHẬT KHUYẾN MÃI ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  discountCon.updateDiscount
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ KHUYẾN MÃI ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  discountCon.toggleDiscountStatus
);

// // === XÓA KHUYẾN MÃI ===
// router.delete("/:id", middlewareCon.authorizeRoles("admin"), discountCon.deleteDiscount);

module.exports = router;
