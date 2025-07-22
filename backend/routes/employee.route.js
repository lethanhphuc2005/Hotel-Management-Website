const router = require("express").Router();

const authMiddleware = require("../middlewares/auth.middleware");
const employeeController = require("../controllers/employee.controller");

// === LẤY TẤT CẢ NHÂN VIÊN ===
router.get(
  "/",
  authMiddleware.authorizeRoles("admin", "receptionist"),
  employeeController.getAllEmployees
);

// == LẤY NHÂN VIÊN THEO ID ===
router.get(
  "/user-info/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  employeeController.getEmployeeById
);

// === CẬP NHẬT THÔNG TIN NHÂN VIÊN ===
router.patch(
  "/update/:id",
  authMiddleware.authorizeSelfOrRoles("admin"),
  employeeController.updateEmployee
);

// === ĐỔI MẬT KHẨU NHÂN VIÊN ===
router.patch(
  "/change-password/:id",
  authMiddleware.authorizeSelfOnly(),
  employeeController.changePassword
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ NHÂN VIÊN ===
router.patch(
  "/toggle/:id",
  authMiddleware.authorizeRoles("admin"),
  employeeController.toggleEmployeeStatus
);

// // === XÓA NHÂN VIÊN ===
// router.delete(
//   "/delete/:id",
//   authMiddleware.authorizeRoles("admin"),
//   employeeController.deleteEmployee
// );

module.exports = router;
