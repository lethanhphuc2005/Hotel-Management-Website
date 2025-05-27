const router = require("express").Router();
const middlewareCon = require("../controllers/middlewareCon");
const employersCon = require("../controllers/employersCon");

// Lấy thông tin 1 user theo token
router.get(
  "/",
  middlewareCon.verifyTokenAndAdminAuth(["admin", "receptionist"]),
  employersCon.getAllEmployers
);

// Lấy thông tin 1 user theo token
router.get(
  "/userinfo/:id",
  middlewareCon.verifyToken,
  employersCon.getAnEmployer
);

router.put(
  "/update/:id",
  middlewareCon.verifyTokenAndAdminAuth(["admin"]),
  employersCon.updateEmployer
);

router.put(
  "/changepassword/:id",
  middlewareCon.verifyToken,
  employersCon.changePassword
);

module.exports = router;
