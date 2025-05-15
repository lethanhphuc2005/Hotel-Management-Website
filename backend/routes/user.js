var express = require("express");
var router = express.Router();

const {
  register,
  login,
  verifyToken,
  getUser,
  getAllUsers,
} = require("../controllers/userCon");

// Lấy thông tin 1 user theo token
router.get("/", getAllUsers);

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

// Lấy thông tin 1 user theo token
router.get("/userinfo", verifyToken, getUser);

module.exports = router;
