const Wallet = require("../models/wallet.model");
const PaymentFactory = require("../utils/paymentFactory");
const VNPAYService = require("../services/payments/vnpay.service");
const { VNPayConfig } = require("../config/payment");

const walletController = {
  // === LẤY THÔNG TIN VÍ THEO USER ID ===
  getWalletByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        wallet = await Wallet.create({ user_id: userId });
      }
      // Populate transactions with type information
      const populatedWallet = await Wallet.findOne({
        user_id: userId,
      }).populate("user_id", "first_name last_name email phone_number");

      res.status(200).json({
        message: "Lấy thông tin ví thành công",
        data: populatedWallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === HOÀN TIỀN VÀO VÍ ===
  refundToWallet: async (req, res) => {
    try {
      const { userId } = req.params;
      const { amount, note } = req.body;

      if (!amount || amount <= 0) {
        return res
          .status(400)
          .json({ message: "Số tiền hoàn trả không hợp lệ" });
      }

      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        wallet = await Wallet.create({ user_id: userId });
      }

      wallet.balance += amount;
      wallet.transactions.push({
        type: "refund",
        amount,
        note,
      });

      await wallet.save();

      res.status(200).json({
        message: "Hoàn tiền vào ví thành công",
        data: wallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === SỬ DỤNG TIỀN TRONG VÍ ===
  useFromWallet: async (req, res) => {
    try {
      const { userId } = req.params;
      const { amount, note } = req.body;

      if (!amount || amount <= 0) {
        return res
          .status(400)
          .json({ message: "Số tiền sử dụng không hợp lệ" });
      }

      let wallet = await Wallet.findOne({ user_id: userId });

      if (!wallet) {
        return res.status(404).json({ message: "Ví không tồn tại" });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ message: "Số dư không đủ" });
      }

      wallet.balance -= amount;
      wallet.transactions.push({
        type: "use",
        amount,
        note,
      });

      await wallet.save();

      res.status(200).json({
        message: "Sử dụng tiền trong ví thành công",
        data: wallet,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  refundInternal: async (userId, amount, note = "") => {
    let wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) wallet = await Wallet.create({ user_id: userId, balance: 0 });

    wallet.balance += amount;
    wallet.transactions.push({
      type: "refund",
      amount,
      note,
    });

    await wallet.save();
    return wallet;
  },

  useInternal: async (userId, amount, note = "") => {
    let wallet = await Wallet.findOne({ user_id: userId });
    if (!wallet) {
      wallet = await Wallet.create({ user_id: userId, balance: 0 });
    }
    if (wallet.balance < amount) {
      return {
        error: true,
        message: "Số dư không đủ"
      };
    }
    wallet.balance -= amount;
    wallet.transactions.push({
      type: "use",
      amount,
      note,
    });
    await wallet.save();
    return wallet;
  },

  createDepositRequest: async (req, res) => {
    try {
      const { method } = req.params;
      const { amount } = req.body;
      const userId = req.user.id;

      if (!method || !amount) {
        return res.status(400).json({
          error: "Phương thức và số tiền nạp là bắt buộc",
        });
      }

      if (amount < 10000) {
        return res.status(400).json({
          error: "Số tiền tối thiểu để nạp là 10.000đ",
        });
      }

      const orderId = `WALLET_${userId}_${Date.now()}`;
      const orderInfo = `Nạp ví cho user ${userId}`;

      const paymentService = PaymentFactory.handlePaymentMethodService(method);

      // Gọi service tạo thanh toán, truyền thêm paymentFor: "wallet"
      const response = await paymentService.handleCreatePayment({
        body: {
          orderId,
          orderInfo,
          amount,
          paymentFor: "wallet",
        },
        ip: req.ip,
      });

      return res.status(200).json({
        success: true,
        data: response,
      });
    } catch (error) {
      console.error("Wallet deposit error:", error.message);
      return res.status(500).json({
        error: error.message || "Lỗi khi xử lý nạp ví",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },

  // === XỬ LÝ IPN TỪ CÁC CỔNG THANH TOÁN ===
  checkIpnDeposit: async (req, res) => {
    try {
      const { method } = req.params;
      console.log("Checking IPN for method:", method);
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

  // === TRẢ VỀ CALLBACK URL CHO VNPAY ===
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
        `${VNPayConfig.walletReturnUrl}?orderId=${req.query.vnp_TxnRef}`
      );
    } catch (error) {
      return res.status(500).send({
        error: error.message || "Lỗi khi xử lý IPN VNPay",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },
};

module.exports = walletController;
