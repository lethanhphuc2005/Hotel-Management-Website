require("dotenv").config();

module.exports = {
  VNPayConfig: {
    tmnCode: process.env.VNPAY_TMNCODE,
    hashSecret: process.env.VNPAY_HASH_SECRET,
    url:
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnpayHost: process.env.VNPAY_API_URL || "https://sandbox.vnpayment.vn",
    queryDrAndRefundHost:
      process.env.VNPAY_QUERY_DR_REFUND_HOST || "https://sandbox.vnpayment.vn", // Default to sandbox URL
    returnUrl: `${process.env.FRONTEND_URL}`,
    notifyUrl: `${process.env.NGROK_URL}/v1/payment/vnpay/callback`,
    testMode: process.env.VNPAY_TEST_MODE === "true", // true for sandbox, false for production
    endpoints: {
      paymentEndpoint: "paymentv2/vpcpay.html",
      queryDrRefundEndpoint: "merchant_webapi/api/transaction",
      getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
    },
    locale: process.env.VNPAY_LOCALE || "vn", // Default to Vietnamese
  },
  MomoConfig: {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    apiUrl:
      process.env.MOMO_API_URL || "https://test-payment.momo.vn/v2/gateway/api",
    returnUrl: `${process.env.FRONTEND_URL}/v1/payment/momo/callback`,
    notifyUrl: `${process.env.NGROK_URL}/v1/payment/momo/ipn`,
    requestType: "payWithMethod",
    locale: process.env.MOMO_LOCALE || "vi", // Default to Vietnamese
  },
  ZaloPayConfig: {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    createUrl: `${process.env.ZALOPAY_API_URL}/create`,
    queryUrl: `${process.env.ZALOPAY_API_URL}/query`,
    callbackUrl: `${process.env.NGROK_URL}/v1/payment/zalopay/ipn`,
    returnUrl: `${process.env.FRONTEND_URL}/v1/payment/zalopay/callback`,
  },
};
