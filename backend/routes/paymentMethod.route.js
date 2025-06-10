const router = require("express").Router();

const paymentMethodCon = require("../controllers/paymentMethod.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === LẤY TẤT CẢ PHƯƠNG THỨC THANH TOÁN ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  paymentMethodCon.getAllPaymentMethods
);

// === LẤY PHƯƠNG THỨC THANH TOÁN THEO ID ===
router.get(
  "/:id",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  paymentMethodCon.getPaymentMethodById
);

// === THÊM PHƯƠNG THỨC THANH TOÁN ===
router.post(
  "/",
  middlewareCon.authorizeRoles("admin"),
  paymentMethodCon.addPaymentMethod
);

// === CẬP NHẬT PHƯƠNG THỨC THANH TOÁN ===
router.put(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  paymentMethodCon.updatePaymentMethod
);

// === XÓA PHƯƠNG THỨC THANH TOÁN ===
router.delete(
  "/:id",
  middlewareCon.authorizeRoles("admin"),
  paymentMethodCon.deletePaymentMethod
);

module.exports = router;
