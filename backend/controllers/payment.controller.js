const PaymentFactory = require("../utils/paymentFactory");
const VNPAYService = require("../services/payments/vnpay.service");

const { VNPayConfig } = require("../config/payment");

const Booking = require("../models/booking.model");
const Payment = require("../models/payment.model");
const PaymentMethod = require("../models/paymentMethod.model");

const PaymentController = {
  createPayment: async (req, res) => {
    try {
      const { method } = req.params;
      if (!method) {
        return res.status(400).json({
          error: "Payment method is required",
        });
      }

      if (method === "cash") {
        // Handle cash payment creation
        const { orderId } = req.body;
        if (!orderId) {
          return res.status(400).json({
            error: "OrderId is required for cash payment",
          });
        }

        const paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /cash/i },
        });

        const booking = await Booking.findById(orderId);
        if (!booking) {
          return res.status(404).json({
            error: "Booking not found",
          });
        }
        if (booking.payment_status === "PAID") {
          return res.status(400).json({
            error: "Booking has already been paid",
          });
        } else if (booking.payment_status === "CANCELED") {
          return res.status(400).json({
            error: "Booking has been canceled",
          });
        }

        // Update booking payment status
        booking.payment_status = "PAID";
        await booking.save();

        // Create a cash payment record
        const payment = new Payment({
          booking_id: orderId,
          amount: booking.total_price,
          payment_method_id: paymentMethod._id,
          status: "completed",
          transaction_id: `cash-${orderId}-${Date.now()}`,
          payment_date: new Date(),
        });

        await payment.save();
        return res.status(200).json({
          success: true,
          message: "Cash payment created successfully",
          data: { orderId, method: "cash" },
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
        `${VNPayConfig.returnUrl}?orderId=${req.query.vnp_TxnRef}`
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
