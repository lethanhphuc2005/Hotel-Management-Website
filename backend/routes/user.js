var express = require("express");
var router = express.Router();

const {
  getAnUser,
  getAllUsers,
  updateUser,
  changePassword,
} = require("../controllers/userCon");
const { verifyToken, register, login } = require("../controllers/accountCon");

// Lấy thông tin 1 user theo token
router.get("/", getAllUsers);

// Lấy thông tin 1 user theo token
router.get("/userinfo", verifyToken, getAnUser);

// Đăng ký
router.post("/register", register);

// Đăng nhập
router.post("/login", login);

router.put("/update/", verifyToken, updateUser);

router.put("/changepassword", verifyToken, changePassword);

module.exports = router;
