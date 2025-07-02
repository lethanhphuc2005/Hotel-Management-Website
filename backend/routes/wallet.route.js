const router = require("express").Router();
const walletController = require("../controllers/wallet.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === LẤY THÔNG TIN VÍ THEO USER ID ===
router.get(
  "/:userId",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  walletController.getWalletByUserId
);

// === HOÀN TIỀN VÀO VÍ ===
router.post(
  "/refund/:userId",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  walletController.refundToWallet
);

// === SỬ DỤNG TIỀN TRONG VÍ ===
router.post(
  "/use/:userId",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  walletController.useFromWallet
);

// === NẠP TIỀN VÀO VÍ ===
router.post(
  "/deposit/:method",
  authMiddleware.authorizeSelfOnly(),
  walletController.createDepositRequest
);

// === XỬ LÝ IPN TỪ CÁC CỔNG THANH TOÁN ===
router.post("/deposit/:method/ipn", walletController.checkIpnDeposit);

// === TRẢ VỀ CALLBACK URL CHO VNPAY ===
router.get(
  "/deposit/vnpay/callback",
  walletController.checkIpnVNPay
);

module.exports = router;
