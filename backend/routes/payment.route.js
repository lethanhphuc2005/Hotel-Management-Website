const router = require("express").Router();
const PaymentController = require("../controllers/payment.controller");

// === TẠO YÊU CẦU THANH TOÁN ===
router.post("/:method/create", PaymentController.createPayment);

// === XỬ LÝ IPN TỪ CÁC CỔNG THANH TOÁN ===
router.post(":method/ipn", PaymentController.checkIpn);

// === LẤY TRẠNG THÁI GIAO DỊCH ===
router.get("/:method/transaction-status", PaymentController.getTransactionStatus);

// === TRẢ VỀ CALLBACK URL CHO VNPAY ===
router.get("/vnpay/return", PaymentController.checkIpnVNPay);

module.exports = router;
