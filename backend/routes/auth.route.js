const router = require("express").Router();
const accountController = require("../controllers/account.controller");
const middlewareCon = require("../middlewares/auth.middleware");

// === ĐĂNG KÝ TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post(
  "/register",
  middlewareCon.authorizeRoles("admin"),
  accountController.addAuthAccount
);

// === ĐĂNG NHẬP TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post("/login", accountController.loginAuth);

module.exports = router;
