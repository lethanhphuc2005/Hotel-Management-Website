const {
  VNPay,
  ignoreLogger,
  ProductCode,
  VnpLocale,
  dateFormat,
} = require("vnpay");
const crypto = require("crypto");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const { VNPayConfig } = require("../../config/payment");

const Payment = require("../../models/payment.model");
const Booking = require("../../models/booking.model");
const PaymentMethod = require("../../models/paymentMethod.model");
const Wallet = require("../../models/wallet.model");
const User = require("../../models/user.model");
const userController = require("../../controllers/user.controller");

const VNPayService = {
  // === KHỞI TẠO VNPay ===
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

  // === TẠO YÊU CẦU THANH TOÁN ===
  handleCreatePayment: async (req, res) => {
    try {
      const { orderId, orderInfo, amount, paymentFor = "booking" } = req.body;

      if (!orderId || !orderInfo || !amount) {
        throw new Error(
          "Missing required fields: orderId, orderInfo, or amount"
        );
      }

      const isWallet = paymentFor === "wallet";

      const notifyUrl = isWallet
        ? VNPayConfig.walletNotifyUrl
        : VNPayConfig.notifyUrl;

      // Nếu là booking, kiểm tra đơn đã được thanh toán chưa
      if (!isWallet) {
        const paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /vnpay/i },
        });

        const successfulPayment = await Payment.findOne({
          booking_id: orderId,
          status: "completed",
        });

        if (successfulPayment) {
          throw new Error("This order has already been paid.");
        }

        const pendingPayment = await Payment.findOne({
          booking_id: orderId,
          status: "pending",
          payment_method_id: paymentMethod._id,
        });

        if (pendingPayment) {
          throw new Error("This order is already being processed.");
        }

        // Lưu bản ghi Payment nếu là booking
        const paymentUrlTemp = "temp"; // placeholder để có metadata.paymentUrl sau
        const payment = new Payment({
          booking_id: orderId,
          amount,
          payment_method_id: paymentMethod._id,
          status: "pending",
          transaction_id: null,
          payment_date: new Date(),
          metadata: { paymentUrl: paymentUrlTemp },
          type: "booking_payment",
        });

        await payment.save(); // lưu trước, lát update lại URL nếu cần
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      const paymentUrl = VNPayService.vnpay.buildPaymentUrl({
        vnp_Amount: amount,
        vnp_IpAddr: req.ip,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: ProductCode.Other,
        vnp_ReturnUrl: notifyUrl,
        vnp_Locale: VnpLocale.VN,
        vnp_CreateDate: dateFormat(new Date()),
        vnp_ExpireDate: dateFormat(tomorrow),
      });

      if (!isWallet) {
        await Payment.findOneAndUpdate(
          { booking_id: orderId },
          { $set: { "metadata.paymentUrl": paymentUrl } }
        );
      }

      return {
        orderId,
        requestId: VNPayService._generateRequestId(),
        amount,
        responseTime: dateFormat(new Date()),
        message: "Payment created successfully",
        payUrl: paymentUrl,
      };
    } catch (error) {
      console.error("VNPay Create Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message || "VNPay payment creation failed",
      });
    }
  },

  // === XÁC THỰC URL TRẢ VỀ TỪ VNPay ===
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

  // === CHUYỂN ĐỔI ĐỊNH DẠNG NGÀY THÁNG VÀ GIỜ SANG UTC ===
  parseToUTC: (str) => {
    const formatted = dayjs.tz(str, "YYYYMMDDHHmmss", "Asia/Ho_Chi_Minh");
    return formatted.toDate(); // trả về Date dạng UTC
  },

  // === XỬ LÝ IPN TỪ VNPay ===
  handleIPN: async (query) => {
    try {
      const isVerified = VNPayService.vnpay.verifyReturnUrl(query);
      if (!isVerified) throw new Error("Chữ ký VNPay không hợp lệ");

      const {
        vnp_TxnRef: orderId,
        vnp_ResponseCode,
        vnp_TransactionNo: transaction_id,
        vnp_PayDate: transaction_date,
      } = query;

      const isWallet = orderId.startsWith("WALLET_");
      const amount = Number(query.vnp_Amount) / 100;
      const payDate = VNPayService.parseToUTC(transaction_date);

      if (vnp_ResponseCode !== "00") {
        return {
          success: false,
          code: "01",
          message: "Giao dịch thất bại từ phía VNPay",
        };
      }

      if (isWallet) {
        const userId = orderId.split("_")[1]; // WALLET_userId_timestamp

        const wallet = await Wallet.findOne({ user_id: userId });
        if (!wallet) throw new Error("Không tìm thấy ví");

        wallet.balance += amount;
        wallet.transactions.push({
          type: "deposit",
          amount,
          note: "Nạp ví thành công qua VNPay",
          created_at: payDate,
        });

        await wallet.save();

        return {
          success: true,
          code: "00",
          message: "Nạp ví thành công",
        };
      } else {
        // TH booking
        const paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /vnpay/i },
        });

        const payment = await Payment.findOne({
          booking_id: orderId,
          payment_method_id: paymentMethod._id,
        });

        if (!payment) throw new Error("Không tìm thấy thanh toán");

        const booking = await Booking.findById(orderId);
        if (!booking) throw new Error("Không tìm thấy booking");

        payment.status = "completed";
        payment.transaction_id = transaction_id;
        payment.payment_date = payDate;

        booking.payment_status = "PAID";

        await payment.save();
        await booking.save();

        if (booking.user_id) {
          const user = await User.findById(booking.user_id);
          if (!user) throw new Error("User not found");

          user.total_spent += Number(amount);
          user.total_bookings += 1;
          const nights = booking.check_out_date
            ? Math.ceil(
                (new Date(booking.check_out_date) -
                  new Date(booking.check_in_date)) /
                  (1000 * 60 * 60 * 24)
              )
            : 1;
          user.total_nights += nights;

          await user.save();
          await userController.handleUpdateLevel(booking.user_id);
        }

        return {
          success: true,
          code: "00",
          message: "Thanh toán booking thành công",
        };
      }
    } catch (error) {
      console.error("VNPay IPN error:", error);
      return {
        success: false,
        code: "99",
        message: error.message || "VNPay IPN xử lý thất bại",
      };
    }
  },

  // === LẤY TRẠNG THÁI GIAO DỊCH ===
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

  // === TẠO MÃ YÊU CẦU DUY NHẤT ===
  _generateRequestId() {
    return crypto.randomBytes(8).toString("hex"); // 16 ký tự hex
  },
};

module.exports = VNPayService;
