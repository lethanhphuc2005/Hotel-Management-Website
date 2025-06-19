const router = require("express").Router();
const PaymentController = require("../controllers/payment.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY DANH SÁCH ĐƠN THANH TOÁN ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin"),
  PaymentController.getAllPayments
);

// === TẠO YÊU CẦU THANH TOÁN ===
router.post("/:method/create", PaymentController.createPayment);

// === XỬ LÝ IPN TỪ CÁC CỔNG THANH TOÁN ===
router.post("/:method/ipn", PaymentController.checkIpn);

// === LẤY TRẠNG THÁI GIAO DỊCH ===
router.get(
  "/:method/transaction-status",
  PaymentController.getTransactionStatus
);

// === TRẢ VỀ CALLBACK URL CHO VNPAY ===
router.get("/vnpay/callback", PaymentController.checkIpnVNPay);

module.exports = router;
