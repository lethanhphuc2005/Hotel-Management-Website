const axios = require("axios");
const crypto = require("crypto");

const { MomoConfig } = require("../../config/payment");

const Booking = require("../../models/booking.model");
const Payment = require("../../models/payment.model");

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
  handleCreatePayment: async (req, res) => {
    const { orderId, orderInfo, amount } = req.body;
    // if (!orderId || !orderInfo || !amount) {
    //   throw new Error(
    //     "Missing required fields: orderId, orderInfo, or amount"
    //   );
    // }

    const accessKey = MomoConfig.accessKey;
    const secretKey = MomoConfig.secretKey;
    const partnerCode = MomoConfig.partnerCode;
    const redirectUrl = MomoConfig.returnUrl;
    const ipnUrl = MomoConfig.notifyUrl;
    const requestId = orderId;
    const requestType = MomoConfig.requestType;
    const extraData = "merchantName=TestMerchant";
    const autoCapture = true;
    const lang = MomoConfig.locale; // Default to Vietnamese

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
      url: MomoConfig.apiUrl + "/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
    };

    try {
      const response = await axios(options);
      const result = response.data;
      console.log("--------------------RESPONSE----------------");
      console.log(result);
      // Validate the MoMo response
      MomoService.validateMomoResponse(result);

      const successfulPaymnent = await Payment.findOne({
        booking_id: orderId,
        status: "completed",
      });

      if (successfulPaymnent) {
        throw new Error(
          `Payment for booking ID ${orderId} has already been processed`
        );
      }

      const pendingMomoPayment = await Payment.findOne({
        booking_id: orderId,
        status: "pending",
        method: "momo",
      });

      if (pendingMomoPayment) {
        throw new Error(
          `Payment for booking ID ${orderId} is already pending`
        );
      }


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
      throw error;
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
        { payment_status: "PAID" },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({
          error: "Booking not found",
        });
      }

      // update the payment record
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
        resultCode: 0, // Assuming "0" means success
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
      throw error;
    }
  },

  handleGetTransactionStatus: async (req, res) => {
    const { orderId } = req.body;

    const rawSignature = `accessKey=${MomoConfig.accessKey}&orderId=${orderId}&partnerCode=${MomoConfig.partnerCode}&requestId=${orderId}`;

    const signature = crypto
      .createHmac("sha256", MomoConfig.secretKey)
      .update(rawSignature)
      .digest("hex");

    const requestBody = JSON.stringify({
      partnerCode: MomoConfig.partnerCode,
      requestId: orderId,
      orderId: orderId,
      signature: signature,
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

    try {
      const response = await axios(options);
      const result = response.data;

      return result;
    } catch (error) {
      console.error("Error getting transaction status:", error);
      throw error;
    }
  },
};

module.exports = MomoService;
