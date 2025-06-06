const router = require("express").Router();

const middlewareCon = require("../middleware/middlewareCon");
const userCon = require("../controllers/userCon");

// === LẤY TẤT CẢ USER ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  userCon.getAllUsers
);

// === LẤY USER THEO ID ===
router.get(
  "/user-info/:id",
  middlewareCon.authorizeSelfOrRoles("admin", "receptionist"),
  userCon.getUserById
);

// === CẬP NHẬT USER ===
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  userCon.updateUser
);

// === KÍCH HOẠT/VÔ HIỆU HÓA USER ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  userCon.toggleUserStatus
);

// === ĐỔI MẬT KHẨU USER ===
router.put(
  "/change-password/:id",
  middlewareCon.authorizeSelfOnly(),
  userCon.changePassword
);

module.exports = router;
