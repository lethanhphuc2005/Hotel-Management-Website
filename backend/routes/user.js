const router = require("express").Router();

const middlewareCon = require("../controllers/middlewareCon");
const userCon = require("../controllers/userCon");

// Lấy tất cả user
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  userCon.getAllUsers
);

// Lấy thông tin 1 user
router.get(
  "/userinfo/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  userCon.getAnUser
);

// Cập nhật thông tin user
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  userCon.updateUser
);

// Đổi mật khẩu user
router.put(
  "/changepassword/:id",
  middlewareCon.authorizeSelfOnly,
  userCon.changePassword
);

module.exports = router;
