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

      const paymentService = PaymentFactory.handlePaymentMethodService(method);
      const response = await paymentService.handleCreatePayment(req);

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error("Payment error:", error.message);
      return res.status(500).json({
        error: error.message || "Failed to process payment callback",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },

  handleCallBack: async (req, res) => {
    try {
      const { method } = req.params;
      if (!method) {
        return res.status(400).json({
          error: "Payment method is required",
        });
      }

      const paymentService = PaymentFactory.handlePaymentMethodService(method);
      const response = await paymentService.handleCallBack(req);
      if (!response) {
        return res.status(400).json({
          error: "Failed to process payment callback",
        });
      }

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error("Payment callback error:", error.message);
      return res.status(error.status || 500).json({
        error: error.message || "Failed to process payment callback",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },

  getTransactionStatus: async (req, res) => {
    try {
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({
          error: "Order ID is required",
        });
      }

      const paymentService = PaymentFactory.handlePaymentMethodService("momo");
      const status = await paymentService.handleGetTransactionStatus(req);

      return res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      console.error("Get transaction status error:", error.message);
      return res.status(500).json({
        error: error.message || "Failed to get transaction status",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};

module.exports = PaymentCon;
