const router = require("express").Router();
const accountCon = require("../controllers/accountCon");
const middlewareCon = require("../middleware/middlewareCon");

// === ĐĂNG KÝ TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post(
  "/register",
  middlewareCon.authorizeRoles("admin"),
  accountCon.addAuthAccount
);

// === ĐĂNG NHẬP TÀI KHOẢN QUẢN TRỊ VIÊN ===
router.post("/login", accountCon.loginAuth);

module.exports = router;
