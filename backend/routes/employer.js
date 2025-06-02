const router = require("express").Router();

const middlewareCon = require("../controllers/middlewareCon");
const employerCon = require("../controllers/employerCon");

// === LẤY TẤT CẢ NHÂN VIÊN ===
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  employerCon.getAllEmployers
);

// == LẤY NHÂN VIÊN THEO ID ===
router.get(
  "/userinfo/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employerCon.getEmployerById
);

// === CẬP NHẬT THÔNG TIN NHÂN VIÊN ===
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employerCon.updateEmployer
);

// === ĐỔI MẬT KHẨU NHÂN VIÊN ===
router.put(
  "/changepassword/:id",
  middlewareCon.authorizeSelfOnly,
  employerCon.changePassword
);

module.exports = router;
