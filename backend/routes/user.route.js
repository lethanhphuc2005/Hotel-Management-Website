const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const userController = require("../controllers/user.controller");

// === LẤY TẤT CẢ USER ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  userController.getAllUsers
);

// === LẤY USER THEO ID ===
router.get(
  "/user-info/:id",
  authMiddleware.authorizeSelfOrRoles("admin", "receptionist"),
  userController.getUserById
);

// === CẬP NHẬT USER ===
router.put(
  "/update/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  userController.updateUser
);

// === KÍCH HOẠT/VÔ HIỆU HÓA USER ===
router.put(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  userController.toggleUserStatus
);

// === ĐỔI MẬT KHẨU USER ===
router.put(
  "/change-password/:id",
  authMiddleware.authorizeSelfOnly(),
  userController.changePassword
);

// === XÁC MINH TÀI KHOẢN QUA EMAIL ===
router.post(
  "/verify",
  userController.verifyUser
);

// === GỬI LẠI MÃ XÁC MINH QUA EMAIL ===
router.post(
  "/resend-verification",
  authMiddleware.authorizeSelfOnly(),
  userController.resendEmailVerification
);

// === QUÊN MẬT KHẨU ===
router.post(
  "/forgot-password",
  userController.forgotPassword
);

// === ĐẶT LẠI MẬT KHẨU ===
router.post(
  "/reset-password",
  userController.resetPassword
);

module.exports = router;
