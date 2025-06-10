const PaymentFactory = require("../utils/paymentFactory");

const PaymentCon = {
  createPayment: async (req, res) => {
    try {
      const { method } = req.params;
      if (!method) {
        return res.status(400).json({
          error: "Payment method is required",
        });
      }

      const paymentService = PaymentFactory.createPaymentService(method);
      const response = await paymentService.createPayment(req);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error creating payment:", error);
      return res.status(500).json({
        error: "Failed to create payment",
        details: error.message,
      });
    }
  },
};

module.exports = PaymentCon;
