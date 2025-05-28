const router = require("express").Router();
const middlewareCon = require("../controllers/middlewareCon");
const employerCon = require("../controllers/employerCon");

// Lấy tất cả nhân viên
router.get(
  "/",
  middlewareCon.authorizeRoles("admin", "receptionist"),
  employerCon.getAllEmployers
);

// Lấy thông tin 1 nhân viên
router.get(
  "/userinfo/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employerCon.getAnEmployer
);

// Cập nhật thông tin nhân viên
router.put(
  "/update/:id",
  middlewareCon.authorizeSelfOrRoles("admin"),
  employerCon.updateEmployer
);

// Đổi mật khẩu nhân viên
router.put(
  "/changepassword/:id",
  middlewareCon.authorizeSelfOnly,
  employerCon.changePassword
);

module.exports = router;
