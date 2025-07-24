const router = require("express").Router();
const accountController = require("../controllers/account.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const passport = require("../config/passport.config");

// === ĐĂNG KÝ TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post(
  "/register",
  authMiddleware.authorizeRoles("admin"),
  accountController.addAuthAccount
);

// === ĐĂNG NHẬP TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post("/login", accountController.loginAuth);

// === ĐĂNG KÝ GOOGLE ===
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email", "openid"] })
);

// === XỬ LÝ KHI GOOGLE TRẢ VỀ ===
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/login",
    session: false,
  }),
  accountController.googleAuthCallback
);

/// === LẤY REFRESH TOKEN ===
router.post("/refresh-token", accountController.requestRefreshToken);

// === ĐĂNG XUẤT TÀI KHOẢN ===
router.post("/logout", accountController.logout);

module.exports = router;
