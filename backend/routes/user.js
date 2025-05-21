const router = require("express").Router();
const { verifyToken } = require("../controllers/middlewareCon");
const {
  getUser,
  getAnUser,
  updateUser,
  changePassword,
} = require("../controllers/userCon");

// Lấy thông tin 1 user theo token
router.get("/", getUser);

// Lấy thông tin 1 user theo token
router.get("/userinfo/:id", verifyToken, getAnUser);

router.put("/update/:id", verifyToken, updateUser);

router.put("/changepassword/:id", verifyToken, changePassword);

module.exports = router;

