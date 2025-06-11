const router = require("express").Router();

const paymentMethodController = require("../controllers/paymentMethod.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ PHƯƠNG THỨC THANH TOÁN ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  paymentMethodController.getAllPaymentMethods
);

// === LẤY PHƯƠNG THỨC THANH TOÁN THEO ID ===
router.get(
  "/:id",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  paymentMethodController.getPaymentMethodById
);

// === THÊM PHƯƠNG THỨC THANH TOÁN ===
router.post(
  "/",
  authMiddleware.authorizeRoles("admin"),
  paymentMethodController.addPaymentMethod
);

// === CẬP NHẬT PHƯƠNG THỨC THANH TOÁN ===
router.put(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  paymentMethodController.updatePaymentMethod
);

// === XÓA PHƯƠNG THỨC THANH TOÁN ===
router.delete(
  "/:id",
  authMiddleware.authorizeRoles("admin"),
  paymentMethodController.deletePaymentMethod
);

module.exports = router;
