const router = require("express").Router();

const middlewareCon = require("../controllers/middlewareCon");
const userCon = require("../controllers/userCon");

// === LẤY TẤT CẢ USER ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  userCon.getAllUsers
);

// === LẤY USER THEO ID ===
router.get(
  "/userinfo/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  userCon.getUserById
);

// === CẬP NHẬT USER ===
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  userCon.updateUser
);

// === ĐỔI MẬT KHẨU USER ===
router.put(
  "/changepassword/:id",
  middlewareCon.authorizeSelfOnly,
  userCon.changePassword
);

module.exports = router;
