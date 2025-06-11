const MomoService = require("../services/payments/momo.service");
const VNPayService = require("../services/payments/vnpay.service");

const PaymentFactory = {
  handlePaymentMethodService: (method) => {
    switch (method) {
      case "momo":
        return MomoService;
      case "vnpay":
        return VNPayService;
      default:
        throw new Error("Unsupported payment method");
    }
  },
};

module.exports = PaymentFactory;
