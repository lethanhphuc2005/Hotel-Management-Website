const axios = require("axios");
const crypto = require("crypto");
const https = require("https");
require("dotenv").config();

const Booking = require("../../models/booking.model");
const Payment = require("../../models/payment.model");
const { transcode } = require("buffer");

const MomoService = {
  validateMomoResponse: (result) => {
    if (!result || typeof result.resultCode === "undefined") {
      throw new Error("Invalid response from MoMo");
    }

    if (result.resultCode !== "0") {
      throw new Error(
        `MoMo error: ${result.message} (Code: ${result.resultCode})`
      );
    }

    return true;
  },
  handleCreatePayment: async (req, res) => {
    const { orderId, orderInfo, amount } = req.body;
    // if (!orderId || !orderInfo || !amount) {
    //   throw new Error(
    //     "Missing required fields: orderId, orderInfo, or amount"
    //   );
    // }

    const accessKey = process.env.MOMO_ACCESS_KEY;
    const secretKey = process.env.MOMO_SECRET_KEY;
    const partnerCode = process.env.MOMO_PARTNER_CODE;
    const redirectUrl = process.env.MOMO_RETURN_URL;
    const ipnUrl = process.env.MOMO_NOTIFY_URL;
    const requestId = orderId;
    const requestType = "payWithMethod";
    const extraData = "merchantName=TestMerchant";
    const autoCapture = true;
    const lang = "vi";

    // Raw signature format (the order is important)
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

    // console.log("--------------------RAW SIGNATURE----------------");
    // console.log(rawSignature);

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    // console.log("--------------------SIGNATURE----------------");
    // console.log(signature);

    const requestBody = JSON.stringify({
      partnerCode: partnerCode,
      partnerName: "Test",
      storeId: "MomoTestStore",
      requestId: requestId,
      amount: amount,
      orderId: orderId,
      orderInfo: orderInfo,
      redirectUrl: redirectUrl,
      ipnUrl: ipnUrl,
      lang: lang,
      requestType: requestType,
      autoCapture: autoCapture,
      extraData: extraData,
      orderGroupId: "",
      signature: signature,
    });

    const options = {
      method: "POST",
      url: process.env.MOMO_API_URL + "/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      const result = response.data;
      // console.log("--------------------RESPONSE----------------");
      // console.log(result);
      // Validate the MoMo response

      if (result.resultCode === 0) {
        const payment = new Payment({
          booking_id: orderId,
          amount: amount,
          method: "momo",
          status: "pending",
          transaction_id: result.transId || null,
          metadata: {
            resultCode: result.resultCode,
            message: result.message,
          },
        });
        await payment.save();
      }
      return result;
    } catch (error) {
      console.error("Error creating payment:", error);
      return res.status(500).json({
        message: "Failed to create payment",
        error: error.message,
      });
    }
  },

  handleCallBack: async (req, res) => {
    const { message, orderId, amount, transId } = req.body;
    if (!message || !orderId || !amount || !transId) {
      throw new Error(
        "Missing required fields: resultCode, message, orderId, amount, or transId"
      );
    }
    try {
      // Here you can handle the successful payment, e.g., update order status in your database
      // console.log(
      //   `Payment successful for order ${orderId}, transaction ID: ${transId}`
      // );

      // Update the booking status to PAID
      const booking = await Booking.findOneAndUpdate(
        { _id: orderId },
        { payment_status: "PAID" }, // Assuming "PAID" is the ID for the paid status
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({
          error: "Booking not found",
        });
      }

      // update the payment record
      // Tìm bản ghi payment theo transId
      const payment = await Payment.findOne({ booking_id: orderId });

      if (!payment) {
        throw new Error(`Payment record not found for booking ID ${orderId}`);
      }

      // Nếu đã thanh toán rồi thì bỏ qua (idempotent)
      if (payment.status === "completed") {
        throw new Error(
          `Payment for booking ID ${orderId} has already been processed`
        );
      }

      // Cập nhật trạng thái thanh toán
      payment.status = "completed"; // Assuming "success" is the ID for the successful status
      payment.transaction_id = transId; // Update transaction ID
      payment.metadata = {
        resultCode: "0", // Assuming "0" means success
        message: message,
      };

      await payment.save();
      // console.log(`Payment record created for booking ${orderId}`);

      return (data = {
        success: true,
        message: "Payment processed successfully",
        booking: booking,
        payment: payment,
      });
    } catch (error) {
      console.error("Error handling MoMo callback:", error);
      return res.status(error.status || 500).json({
        error: error.message || "Failed to process payment callback",
        code: error.code || "INTERNAL_SERVER_ERROR",
      });
    }
  },

  handleGetTransactionStatus: async (req, res) => {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${process.env.MOMO_ACCESS_KEY}&orderId=${orderId}&partnerCode=${process.env.MOMO_PARTNER_CODE}&requestId=${orderId}`;

    const signature = crypto
      .createHmac("sha256", process.env.MOMO_SECRET_KEY)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: process.env.MOMO_PARTNER_CODE,
      requestId: orderId,
      orderId: orderId,
      signature: signature,
      lang: "vi",
    });

    const options = {
      method: "POST",
      url: process.env.MOMO_API_URL + "/query",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      const result = response.data;

      return result;
    } catch (error) {
      console.error("Error getting transaction status:", error);
      return res.status(500).json({
        message: "Failed to get transaction status",
        error: error.message,
      });
    }
  },
};

module.exports = MomoService;
