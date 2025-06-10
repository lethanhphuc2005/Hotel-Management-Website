const axios = require("axios");
const crypto = require("crypto");
const https = require("https");
require("dotenv").config();

const agent = new https.Agent({
  rejectUnauthorized: false, // ⚠️ Chỉ dùng khi debug local
});

const MomoService = {
  createPayment: async (req, res) => {
    const { orderId, orderInfo, amount } = req.body;
    if (!orderId || !orderInfo || !amount) {
      return res.status(400).json({
        error: "Missing required fields: orderId, orderInfo, or amount",
      });
    }

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

    console.log("--------------------RAW SIGNATURE----------------");
    console.log(rawSignature);

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(rawSignature)
      .digest("hex");

    console.log("--------------------SIGNATURE----------------");
    console.log(signature);

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
    console.log("Request URL:", process.env.MOMO_API_URL + "/create");

    const options = {
      method: "POST",
      url: process.env.MOMO_API_URL + "/create",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
      data: requestBody,
      httpsAgent: agent, // Sử dụng agent để bỏ qua SSL certificate
    };

    let result;
    try {
      result = await axios(options);
      return result.data
    } catch (error) {
      console.error("Error creating payment:", error);
      return res.status(500).json({
        message: "Failed to create payment",
        error: error.message,
      });
    }
  },
};

module.exports = MomoService;
