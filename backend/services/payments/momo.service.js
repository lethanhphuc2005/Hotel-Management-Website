// services/payments/momo.service.js
const axios = require("axios");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const { MomoConfig } = require("../../config/payment");
const Booking = require("../../models/booking.model");
const Payment = require("../../models/payment.model");
const PaymentMethod = require("../../models/paymentMethod.model");
const Wallet = require("../../models/wallet.model");

const MomoService = {
  validateMomoResponse: (result) => {
    if (!result || typeof result.resultCode === "undefined") {
      throw new Error("Invalid response from MoMo");
    }
    if (result.resultCode !== 0) {
      throw new Error(
        `MoMo error: ${result.message} (Code: ${result.resultCode})`
      );
    }
    return true;
  },

  handleCreatePayment: async (req) => {
    const {
      orderId,
      orderInfo,
      amount,
      paymentFor = "booking",
    } = req.body;

    const isWallet = paymentFor === "wallet";
    const ipnUrl = isWallet ? MomoConfig.walletNotifyUrl : MomoConfig.notifyUrl;
    const redirectUrl = isWallet
      ? MomoConfig.walletReturnUrl
      : MomoConfig.returnUrl;

    const requestId = uuidv4();
    const rawSignature = `accessKey=${MomoConfig.accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MomoConfig.partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${MomoConfig.requestType}`;

    const signature = crypto
      .createHmac("sha256", MomoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: MomoConfig.partnerCode,
      partnerName: "Hotel Booking",
      storeId: "MomoTestStore",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      lang: MomoConfig.locale,
      requestType: MomoConfig.requestType,
      autoCapture: true,
      extraData: "",
      orderGroupId: "",
      signature,
    });
    const options = {
      method: "POST",
      url: MomoConfig.apiUrl + "/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const response = await axios(options);
    const result = response.data;
    MomoService.validateMomoResponse(result);

    if (result.resultCode === 0) {
      if (!isWallet) {
        const paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /^momo$/i },
        });
        const existingPayment = await Payment.findOne({
          booking_id: orderId,
          status: { $in: ["pending", "completed"] },
        });
        if (!existingPayment) {
          const payment = new Payment({
            booking_id: orderId,
            amount,
            payment_method_id: paymentMethod._id,
            status: "pending",
            transaction_id: result.transId || null,
            payment_date: new Date(result.responseTime),
            metadata: {
              resultCode: result.resultCode,
              message: result.message,
            },
          });
          await payment.save();
        }
      }
    }

    return result;
  },

  handleCallBack: async (req) => {
    const { message, orderId, amount, transId, resultCode, responseTime } =
      req.body;
    if (!message || !orderId || !amount || !transId)
      throw new Error("Missing required MoMo callback fields");

    const isWallet = orderId.startsWith("WALLET_");
    if (isWallet) {
      const userIdFromOrder = orderId.split("_")[1];

      const wallet = await Wallet.findOne({ user_id: userIdFromOrder });
      if (!wallet) throw new Error("Wallet not found");

      wallet.balance += Number(amount);
      wallet.transactions.push({
        type: "deposit",
        amount,
        note: "Nạp ví thành công qua Momo",
        created_at: new Date(responseTime),
      });

      await wallet.save();
      return { success: true, message: "Nạp ví thành công", wallet };
    } else {
      const booking = await Booking.findOneAndUpdate(
        { _id: orderId },
        { payment_status: "PAID" },
        { new: true }
      );
      if (!booking) throw new Error("Booking not found");

      const payment = await Payment.findOne({ booking_id: orderId });
      if (!payment || payment.status === "completed") return;

      payment.status = "completed";
      payment.transaction_id = transId;
      payment.payment_date = new Date(responseTime);
      payment.metadata = { resultCode, message };
      await payment.save();

      return {
        success: true,
        message: "Thanh toán thành công",
        booking,
        payment,
      };
    }
  },

  handleGetTransactionStatus: async (req) => {
    const { orderId } = req.body;
    const requestId = uuidv4();

    const rawSignature = `accessKey=${MomoConfig.accessKey}&orderId=${orderId}&partnerCode=${MomoConfig.partnerCode}&requestId=${requestId}`;
    const signature = crypto
      .createHmac("sha256", MomoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: MomoConfig.partnerCode,
      requestId,
      orderId,
      signature,
      lang: "vi",
    });

    const options = {
      method: "POST",
      url: MomoConfig.apiUrl + "/query",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    const response = await axios(options);
    return response.data;
  },
};

module.exports = MomoService;
