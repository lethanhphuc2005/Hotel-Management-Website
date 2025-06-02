const router = require("express").Router();

const accountCon = require("../controllers/accountCon");
const middlewareCon = require("../controllers/middlewareCon");

// === ĐĂNG KÝ TÀI KHOẢN ===
router.post("/register/", accountCon.addUserAccount);

// === ĐĂNG NHẬP TÀI KHOẢN ===
router.post("/login/", accountCon.loginUser);

// === ĐĂNG XUẤT TÀI KHOẢN ===
router.post("/logout", middlewareCon.verifyToken, accountCon.logout);

/// === LẤY REFRESH TOKEN ===
router.post("/refresh", middlewareCon.verifyToken, accountCon.requestRefreshToken);

module.exports = router;
