const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
  QueryDr,
  QueryDrResponse,
  getDateInGMT7,
} = require("vnpay");
const crypto = require("crypto");

const { VNPayConfig } = require("../../config/payment");

const Payment = require("../../models/payment.model");
const Booking = require("../../models/booking.model");

const VNPayService = {
  vnpay: new VNPay({
    tmnCode: VNPayConfig.tmnCode,
    secureSecret: VNPayConfig.hashSecret,
    vnpayHost: VNPayConfig.vnpayHost,
    queryDrAndRefundHost: VNPayConfig.queryDrAndRefundHost, // tùy chọn, trường hợp khi url của querydr và refund khác với url khởi tạo thanh toán (thường sẽ sử dụng cho production)

    testMode: VNPayConfig.testMode, // true nếu đang ở môi trường test, false nếu ở môi trường production
    hashAlgorithm: "SHA512", // tùy chọn

    /**
     * Bật/tắt ghi log
     * Nếu enableLog là false, loggerFn sẽ không được sử dụng trong bất kỳ phương thức nào
     */
    enableLog: true, // tùy chọn

    /**
     * Hàm `loggerFn` sẽ được gọi để ghi log khi enableLog là true
     * Mặc định, loggerFn sẽ ghi log ra console
     * Bạn có thể cung cấp một hàm khác nếu muốn ghi log vào nơi khác
     *
     * `ignoreLogger` là một hàm không làm gì cả
     */
    loggerFn: ignoreLogger, // tùy chọn

    /**
     * Tùy chỉnh các đường dẫn API của VNPay
     * Thường không cần thay đổi trừ khi:
     * - VNPay cập nhật đường dẫn của họ
     * - Có sự khác biệt giữa môi trường sandbox và production
     */
    endpoints: {
      paymentEndpoint: VNPayConfig.endpoints.paymentEndpoint,
      queryDrRefundEndpoint: VNPayConfig.endpoints.queryDrRefundEndpoint,
      getBankListEndpoint: VNPayConfig.endpoints.getBankListEndpoint,
    },
  }),

  handleCreatePayment: async (req, res) => {
    try {
      const { orderId, orderInfo, amount } = req.body;
      if (!orderId || !orderInfo || !amount) {
        throw new Error(
          "Missing required fields: orderId, orderInfo, or amount"
        );
      }

      const successfulPayment = await Payment.findOne({
        booking_id: orderId,
        status: "completed",
      });

      if (successfulPayment) {
        throw new Error(
          "This order has already been paid. Please check your payment history."
        );
      }

      const pendingVNPay = await Payment.findOne({
        booking_id: orderId,
        status: "pending",
        method: "vnpay",
      });

      if (pendingVNPay) {
        throw new Error(
          "This order is already being processed by VNPay. Please wait for the payment to complete or cancel the order."
        );
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const paymentUrl = VNPayService.vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: req.ip, // Địa chỉ IP của người dùng
        vnp_TxnRef: orderId, // Mã đơn hàng duy nhất
        vnp_OrderInfo: orderInfo, // Thông tin mô tả đơn hàng
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: VNPayConfig.returnUrl, // URL sẽ được VNPay gọi lại sau khi thanh toán
        vnp_Locale: VnpLocale.VN, // 'vn' hoặc 'en'
        vnp_CreateDate: dateFormat(new Date()), // tùy chọn, mặc định là thời gian hiện tại
        vnp_ExpireDate: dateFormat(tomorrow), // tùy chọn
      });

      const payment = new Payment({
        booking_id: orderId,
        amount: amount,
        method: "vnpay",
        status: "pending",
        transaction_id: null,
        metadata: { paymentUrl: paymentUrl },
      });
      await payment.save();

      return {
        orderId: orderId,
        message: "VNPay payment created successfully",
        paymentUrl: paymentUrl,
      };
    } catch (error) {
      console.error("Error creating VNPay payment:", error);
      throw error;
    }
  },

  verifyReturnUrl(query) {
    try {
      const isVerified = VNPayService.vnpay.verifyReturnUrl(query);
      if (!isVerified) {
        return { isVerified: false, isSuccess: false };
      }

      const responseCode = query.vnp_ResponseCode;
      const isSuccess = responseCode === "00";

      return { isVerified: true, isSuccess };
    } catch (error) {
      console.error("Error verifying VNPay return URL:", error);
      return { isVerified: false, isSuccess: false, error: error.message };
    }
  },

  handleIPN: async (query) => {
    try {
      const verify = VNPayService.vnpay.verifyReturnUrl(query);
      if (!verify.isVerified) {
        throw new Error("Invalid signature");
      }

      const {
        vnp_TxnRef: booking_id,
        vnp_ResponseCode,
        vnp_TransactionNo: transaction_id,
      } = query;

      const payment = await Payment.findOne({ booking_id, method: "vnpay" });
      if (!payment) {
        throw new Error(
          `Payment record not found for booking ID ${booking_id}`
        );
      }

      const booking = await Booking.findById(booking_id);
      if (!booking) {
        throw new Error(`Booking not found for ID ${booking_id}`);
      }

      if (vnp_ResponseCode === "00") {
        payment.status = "completed";
        payment.transaction_id = transaction_id;
        booking.payment_status = "PAID";
      } else {
        payment.status = "failed";
        payment.transaction_id = transaction_id;
        booking.payment_status = "UNPAID";
      }

      await payment.save();
      await booking.save();
      // console.log(
      //   `Payment for booking ID ${booking_id} updated to status: ${payment.status}`
      // );

      return { success: true, code: "00", message: "Payment updated" };
    } catch (error) {
      console.error("Error handling VNPay IPN:", error);
      return {
        success: false,
        code: "99",
        message: error.message || "IPN failed",
      };
    }
  },

  handleGetTransactionStatus: async (req) => {
    try {
      const { orderId, transactionDate } = req.body;
      if (!orderId || !transactionDate) {
        throw new Error("Missing required fields: orderId or transactionDate");
      }
      const dateObj = new Date(transactionDate);
      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid transactionDate format");
      }
      
      const date = dateFormat(new Date(dateObj));

      const requestData = {
        vnp_RequestId: VNPayService._generateRequestId(), // Mã yêu cầu duy nhất
        vnp_IpAddr: req.ip,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: `Kiểm tra giao dịch cho đơn hàng ${orderId}`,
        vnp_TransactionDate: date,
        vnp_CreateDate: date,
      };

      const response = await VNPayService.vnpay.queryDr(requestData, {
        logger: {
          type: "all",
          loggerFn: (data) => console.log(data.message),
        },
      });

      if (!response || !response.vnp_ResponseCode) {
        throw new Error("No response from VNPay or invalid response format");
      }

      if (response.vnp_ResponseCode !== "00") {
        throw new Error(
          `VNPay transaction status query failed with code: ${response.vnp_ResponseCode}, message: ${response.vnp_Message}`
        );
      }

      return response;
    } catch (error) {
      console.error("Error getting VNPay transaction status:", error);
      throw {
        success: false,
        message: error.message || "Failed to retrieve transaction status",
        code: error.code || "INTERNAL_SERVER_ERROR",
      };
    }
  },

  _generateRequestId() {
    return crypto.randomBytes(8).toString("hex"); // 16 ký tự hex
  },
};

module.exports = VNPayService;
