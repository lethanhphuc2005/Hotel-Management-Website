const router = require("express").Router();
const PaymentCon = require("../controllers/payment.controller");

// === TẠO YÊU CẦU THANH TOÁN ===
router.post("/create/:method", PaymentCon.createPayment);

// === XỬ LÝ CALLBACK TỪ CÁC CỔNG THANH TOÁN ===
router.post("/callback/:method", PaymentCon.handleCallBack);

// === LẤY TRẠNG THÁI GIAO DỊCH ===
router.get("/transaction-status/:method", PaymentCon.getTransactionStatus);

module.exports = router;
