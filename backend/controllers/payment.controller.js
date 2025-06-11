const PaymentFactory = require("../utils/paymentFactory");
const VNPAYService = require("../services/payments/vnpay.service");

const PaymentController = {
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

  checkIpn: async (req, res) => {
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
      const { method } = req.params;
      if (!method) {
        return res.status(400).json({
          error: "Payment method is required",
        });
      }
      const { orderId } = req.body;
      if (!orderId) {
        return res.status(400).json({
          error: "Order ID is required",
        });
      }

      const paymentService = PaymentFactory.handlePaymentMethodService(method);
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

  checkIpnVNPay: async (req, res) => {
    try {
      const result = VNPAYService.verifyReturnUrl(req.query);

      if (!result.isVerified) {
        return res.send("Chữ ký không hợp lệ!");
      }

      if (!result.isSuccess) {
        return res.send("Giao dịch không thành công!");
      }

      // ✅ Gọi IPN xử lý tự động ở đây
      const ipnResult = await VNPAYService.handleIPN(req.query);

      if (!ipnResult.success) {
        return res.send(`Xử lý IPN thất bại: ${ipnResult.message}`);
      }

      // ✅ Giao dịch thành công + xử lý IPN thành công
      // Có thể redirect sang frontend
      return res.redirect(
        `${process.env.FRONTEND_PAYMENT_SUCCESS_URL}?orderId=${req.query.vnp_TxnRef}`
      );
    } catch (error) {
      return res.status(500).send({
        error: error.message || "Lỗi khi xử lý IPN VNPay",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};

module.exports = PaymentController;
