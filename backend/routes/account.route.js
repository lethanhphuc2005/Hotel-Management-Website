const router = require("express").Router();

const accountController = require("../controllers/account.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === ĐĂNG KÝ TÀI KHOẢN ===
router.post("/register/", accountController.addUserAccount);

// === ĐĂNG NHẬP TÀI KHOẢN ===
router.post("/login/", accountController.loginUser);

// === ĐĂNG XUẤT TÀI KHOẢN ===
router.post("/logout", middlewareCon.verifyToken, accountController.logout);

/// === LẤY REFRESH TOKEN ===
router.post(
  "/refresh",
  middlewareCon.verifyToken,
  accountController.requestRefreshToken
);

module.exports = router;
