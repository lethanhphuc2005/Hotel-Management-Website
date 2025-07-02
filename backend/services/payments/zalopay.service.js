const axios = require("axios");
const CryptoJS = require("crypto-js");
const moment = require("moment");
const qs = require("qs");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone");
dayjs.extend(utc);
dayjs.extend(timezone);

const { ZaloPayConfig } = require("../../config/payment");

const Booking = require("../../models/booking.model");
const Payment = require("../../models/payment.model");
const PaymentMethod = require("../../models/paymentMethod.model");
const Wallet = require("../../models/wallet.model");

const ZaloPayService = {
  // === TẠO YÊU CẦU THANH TOÁN ===
  handleCreatePayment: async (req, res) => {
    const { orderId, amount, orderInfo, paymentFor = "booking" } = req.body;
    if (!orderId || !amount || !orderInfo) {
      throw new Error("Missing required fields: orderId, amount, or orderInfo");
    }

    const isWallet = paymentFor === "wallet";
    const callbackUrl = isWallet
      ? ZaloPayConfig.walletCallbackUrl
      : ZaloPayConfig.callbackUrl;
    const returnUrl = isWallet
      ? ZaloPayConfig.walletReturnUrl
      : ZaloPayConfig.returnUrl;
    const embed_data = {
      orderId: orderId,
      redirecturl: returnUrl, // URL to redirect after payment
    };

    const items = [];
    const transID = Math.floor(Math.random() * 1000000);

    const order = {
      app_id: ZaloPayConfig.app_id,
      app_trans_id: `${moment().format("YYMMDD")}_${transID}`, // translation missing: vi.docs.shared.sample_code.comments.app_trans_id
      app_user: "user123",
      app_time: Date.now(), // miliseconds
      item: JSON.stringify(items),
      embed_data: JSON.stringify(embed_data),
      amount: amount, // amount in VND
      //khi thanh toán xong, zalopay server sẽ POST đến url này để thông báo cho server của mình
      //Chú ý: cần dùng ngrok để public url thì Zalopay Server mới call đến được
      callback_url: callbackUrl,
      description: orderInfo,
      bank_code: "",
    };

    // appid|app_trans_id|appuser|amount|apptime|embeddata|item
    const data =
      ZaloPayConfig.app_id +
      "|" +
      order.app_trans_id +
      "|" +
      order.app_user +
      "|" +
      order.amount +
      "|" +
      order.app_time +
      "|" +
      order.embed_data +
      "|" +
      order.item;
    order.mac = CryptoJS.HmacSHA256(data, ZaloPayConfig.key1).toString();

    const options = {
      method: "POST",
      url: ZaloPayConfig.createUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: order,
    };

    try {
      let paymentMethod;
      if (!isWallet) {
        paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /zalopay/i },
        });
        if (!paymentMethod) {
          throw new Error("ZaloPay payment method not found");
        }

        const successfulPayment = await Payment.findOne({
          booking_id: orderId,
          status: "completed",
        });

        if (successfulPayment) {
          throw new Error(
            `Payment for booking ID ${orderId} has already been processed`
          );
        }

        const pendingPayment = await Payment.findOne({
          booking_id: orderId,
          payment_method_id: paymentMethod._id,
        });

        if (pendingPayment) {
          throw new Error(
            "This order is already being processed by ZaloPay. Please wait for the payment to complete or cancel the order."
          );
        }
      }

      const response = await axios(options);
      const result = response.data;

      // Validate the ZaloPay response
      if (result.return_code !== 1) {
        throw new Error(
          `ZaloPay payment creation failed: ${result.return_message}`
        );
      }
      // Create a new payment record
      if (!isWallet) {
        const payment = new Payment({
          booking_id: orderId,
          amount: amount,
          payment_method_id: paymentMethod._id,
          status: "pending",
          transaction_id: result.zp_trans_token,
          payment_date: new Date(),
          metadata: {
            resultCode: result.return_code,
            message: result.return_message,
            appTransId: order.app_trans_id,
            zpTransToken: result.zp_trans_token, // nếu có
          },
        });

        await payment.save();
      }

      return result;
    } catch (error) {
      console.error("Error creating ZaloPay payment:", error);
      throw error;
    }
  },

  // === XỬ LÝ IPN TỪ ZALOPAY ===
  handleCallBack: async (req, res) => {
    try {
      const { data, mac } = req.body;
      if (!data) {
        throw new Error("Missing data in ZaloPay callback");
      }

      // Verify MAC
      const computedMac = CryptoJS.HmacSHA256(
        data,
        ZaloPayConfig.key2
      ).toString();
      if (mac !== computedMac) {
        throw new Error("Invalid MAC in ZaloPay callback");
      }

      const parsedData = JSON.parse(data);

      const embedData = JSON.parse(parsedData.embed_data);
      const orderId = embedData.orderId;

      const isWallet = orderId.startsWith("WALLET_");
      const { zp_trans_id, amount, app_trans_id } = parsedData;

      if (isWallet) {
        const userId = orderId.split("_")[1];
        const wallet = await Wallet.findOne({ user_id: userId });
        if (!wallet) {
          throw new Error(`Wallet not found for user ID ${userId}`);
        }

        // Update wallet balance
        wallet.balance += Number(amount);
        wallet.transactions.push({
          type: "deposit",
          amount,
          note: "Nạp ví thành công qua ZaloPay",
          created_at: new Date(),
        });

        await wallet.save();

        return {
          success: true,
          message: "ZaloPay wallet deposit processed successfully",
        };
      } else {
        const paymentMethod = await PaymentMethod.findOne({
          name: { $regex: /zalopay/i },
        });

        if (!paymentMethod) {
          throw new Error("ZaloPay payment method not found");
        }

        const booking = await Booking.findOneAndUpdate(
          { _id: orderId },
          { payment_status: "PAID" },
          { new: true }
        );
        if (!booking) {
          throw new Error(`Booking not found for ID ${orderId}`);
        }

        const payment = await Payment.findOneAndUpdate(
          {
            booking_id: orderId,
            payment_method_id: paymentMethod._id,
          },
          {
            status: "completed",
            transaction_id: app_trans_id,
            payment_date: new Date(),
            metadata: {
              resultCode: parsedData.return_code,
              message: parsedData.return_message,
              zpTransId: zp_trans_id,
            },
          },
          { new: true }
        );

        if (!payment) {
          throw new Error(`Payment record not found for booking ID ${orderId}`);
        }
      }

      return {
        success: true,
        message: "ZaloPay payment processed successfully",
        data: {
          orderId: orderId,
          amount: amount,
          transaction_id: zp_trans_id,
        },
      };
    } catch (error) {
      console.error("ZaloPay callback error:", error);
      throw error;
    }
  },

  // === LẤY TRẠNG THÁI GIAO DỊCH ===
  handleGetTransactionStatus: async (req, res) => {
    const { orderId } = req.body;
    if (!orderId) {
      throw new Error("Missing orderId in request");
    }

    let postData = {
      app_id: ZaloPayConfig.app_id,
      app_trans_id: orderId,
    };

    let data =
      postData.app_id + "|" + postData.app_trans_id + "|" + ZaloPayConfig.key1;
    postData.mac = CryptoJS.HmacSHA256(data, ZaloPayConfig.key1).toString();
    let postConfig = {
      method: "POST",
      url: ZaloPayConfig.queryUrl,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: qs.stringify(postData),
    };

    try {
      const result = await axios(postConfig);
      if (result.data.return_code !== 1) {
        throw new Error(
          `ZaloPay transaction status query failed: ${result.data.return_message} (${result.data.sub_return_message})`
        );
      }

      return result.data;
    } catch (error) {
      console.error("Error retrieving ZaloPay transaction status:", error);
      throw error;
    }
  },
};

module.exports = ZaloPayService;
