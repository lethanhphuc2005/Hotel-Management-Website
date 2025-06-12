const MomoService = require("../services/payments/momo.service");
const VNPayService = require("../services/payments/vnpay.service");
const ZaloPayService = require("../services/payments/zalopay.service");

const PaymentFactory = {
  handlePaymentMethodService: (method) => {
    switch (method) {
      case "momo":
        return MomoService;
      case "vnpay":
        return VNPayService;
      case "zalopay":
        return ZaloPayService;
      default:
        throw new Error("Unsupported payment method");
    }
  },
};

module.exports = PaymentFactory;
