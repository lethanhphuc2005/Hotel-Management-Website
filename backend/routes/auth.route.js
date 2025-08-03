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

// === ĐĂNG KÝ FACEBOOK ===
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"], prompt: "select_account" })
);

// === XỬ LÝ KHI FACEBOOK TRẢ VỀ ===
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/auth/login",
    session: false,
  }),
  accountController.facebookAuthCallback
);

/// === LẤY REFRESH TOKEN CHO CLIEND ===
router.post(
  "/refresh-token-client",
  accountController.requestRefreshTokenClient
);

// === LẤY REFRESH TOKEN CHO ADMIN ===
router.post("/refresh-token-admin", accountController.requestRefreshTokenAdmin);

// === ĐĂNG XUẤT TÀI KHOẢN CHO CLIENT ===
router.post("/logout-client", accountController.logoutClient);

// === ĐĂNG XUẤT TÀI KHOẢN CHO ADMIN ===
router.post("/logout-admin", accountController.logoutAdmin);

module.exports = router;
