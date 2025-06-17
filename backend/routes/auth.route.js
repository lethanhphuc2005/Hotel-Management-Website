const router = require("express").Router();
const accountController = require("../controllers/account.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authController = require("../controllers/auth.controller");


router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-otp", authController.verifyResetOtp);
router.post("/reset-password", authController.resetPassword);

// Xác minh OTP
router.post("/verify-otp", authController.verifyOtp);

router.post("/resend-otp", authController.resendOtp); // ← Thêm dòng này

// === ĐĂNG KÝ TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post(
  "/register",
  authMiddleware.authorizeRoles("admin"),
  accountController.addAuthAccount
);

// === ĐĂNG NHẬP TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post("/login", accountController.loginAuth);

// ✅ CHỈ GỌI 1 LẦN
module.exports = router;
