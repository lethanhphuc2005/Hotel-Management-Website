var express = require("express");
var router = express.Router();

const {
  getAnUser,
  getAllUsers,
  updateUser,
} = require("../controllers/userCon");

// Lấy thông tin 1 user theo token
router.get("/", getAllUsers);

// Lấy thông tin 1 user theo token
router.get("/:id", getAnUser);

module.exports = router;
