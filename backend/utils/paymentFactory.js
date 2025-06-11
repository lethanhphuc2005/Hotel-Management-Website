const MomoService = require("../services/payments/momo.service");

const PaymentFactory = {
  handlePaymentMethodService: (method) => {
    switch (method) {
      case "momo":
        return MomoService;
      // Add other payment methods here as needed
      default:
        throw new Error("Unsupported payment method");
    }
  },
};

module.exports = PaymentFactory;
