const router = require("express").Router();
const accountController = require("../controllers/account.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// === ĐĂNG KÝ TÀI KHOẢN ===
router.post("/register/", accountController.addUserAccount);

// === ĐĂNG NHẬP TÀI KHOẢN ===
router.post("/login/", accountController.loginUser);

module.exports = router;
