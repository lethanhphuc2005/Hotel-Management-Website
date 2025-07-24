require("dotenv").config();

module.exports = {
  // === Cấu hình thanh toán ===
  VNPayConfig: {
    tmnCode: process.env.VNPAY_TMNCODE,
    hashSecret: process.env.VNPAY_HASH_SECRET,
    url:
      process.env.VNPAY_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnpayHost: process.env.VNPAY_API_URL || "https://sandbox.vnpayment.vn",
    queryDrAndRefundHost:
      process.env.VNPAY_QUERY_DR_REFUND_HOST || "https://sandbox.vnpayment.vn",

    // Trả về cho booking
    returnUrl: `${process.env.FRONTEND_URL}/thank-you`,
    notifyUrl: `${process.env.NGROK_URL}/api/v1/payment/vnpay/callback`,

    // Trả về cho ví
    walletReturnUrl: `${process.env.FRONTEND_URL}/profile`,
    walletNotifyUrl: `${process.env.NGROK_URL}/api/v1/wallet/deposit/vnpay/callback`,

    testMode: process.env.VNPAY_TEST_MODE === "true",
    endpoints: {
      paymentEndpoint: "paymentv2/vpcpay.html",
      queryDrRefundEndpoint: "merchant_webapi/api/transaction",
      getBankListEndpoint: "qrpayauth/api/merchant/get_bank_list",
    },
    locale: process.env.VNPAY_LOCALE || "vn",
  },

  MomoConfig: {
    partnerCode: process.env.MOMO_PARTNER_CODE,
    accessKey: process.env.MOMO_ACCESS_KEY,
    secretKey: process.env.MOMO_SECRET_KEY,
    apiUrl:
      process.env.MOMO_API_URL || "https://test-payment.momo.vn/v2/gateway/api",

    // Trả về cho booking
    returnUrl: `${process.env.FRONTEND_URL}/thank-you`,
    notifyUrl: `${process.env.NGROK_URL}/api/v1/payment/momo/ipn`,

    // Trả về cho ví
    walletReturnUrl: `${process.env.FRONTEND_URL}/profile`,
    walletNotifyUrl: `${process.env.NGROK_URL}/api/v1/wallet/deposit/momo/ipn`,

    requestType: "payWithMethod",
    locale: process.env.MOMO_LOCALE || "vi",
  },

  ZaloPayConfig: {
    app_id: process.env.ZALOPAY_APP_ID,
    key1: process.env.ZALOPAY_KEY1,
    key2: process.env.ZALOPAY_KEY2,
    createUrl: `${process.env.ZALOPAY_API_URL}/create`,
    queryUrl: `${process.env.ZALOPAY_API_URL}/query`,

    // Trả về cho booking
    callbackUrl: `${process.env.NGROK_URL}/api/v1/payment/zalopay/ipn`,
    returnUrl: `${process.env.FRONTEND_URL}/thank-you`,

    // Trả về cho ví
    walletCallbackUrl: `${process.env.NGROK_URL}/api/v1/wallet/deposit/zalopay/ipn`,
    walletReturnUrl: `${process.env.FRONTEND_URL}/profile`,
  },
};
