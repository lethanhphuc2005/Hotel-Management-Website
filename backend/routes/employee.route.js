const router = require("express").Router();

const middlewareCon = require("../middlewares/auth.middleware");
const employeeCon = require("../controllers/employee.controller");

// === LẤY TẤT CẢ NHÂN VIÊN ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  employeeCon.getAllEmployees
);

// == LẤY NHÂN VIÊN THEO ID ===
router.get(
  "/user-info/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employeeCon.getEmployeeById
);

// === CẬP NHẬT THÔNG TIN NHÂN VIÊN ===
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employeeCon.updateEmployee
);

// === ĐỔI MẬT KHẨU NHÂN VIÊN ===
router.put(
  "/change-password/:id",
  middlewareCon.authorizeSelfOnly(),
  employeeCon.changePassword
);

// === KÍCH HOẠT/ VÔ HIỆU HOÁ NHÂN VIÊN ===
router.put(
  "/toggle/:id",
  middlewareCon.authorizeRoles("admin"),
  employeeCon.toggleEmployeeStatus
);

// // === XÓA NHÂN VIÊN ===
// router.delete(
//   "/delete/:id",
//   middlewareCon.authorizeRoles("admin"),
//   employeeCon.deleteEmployee
// );

module.exports = router;
