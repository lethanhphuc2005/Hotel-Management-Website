const router = require('express').Router();
const PaymentCon = require('../controllers/payment.controller');

// === TẠO YÊU CẦU THANH TOÁN ===
router.post(
  '/create/:method',
  PaymentCon.createPayment
);

module.exports = router;