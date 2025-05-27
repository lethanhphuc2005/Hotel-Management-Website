const router = require("express").Router();
const middlewareCon = require("../controllers/middlewareCon");
const userCon = require("../controllers/userCon");

// Lấy thông tin 1 user theo token
router.get("/", middlewareCon.verifyTokenAndAdminAuth(["admin","receptionist"]), userCon.getUser);

// Lấy thông tin 1 user theo token
router.get("/userinfo/:id", middlewareCon.verifyToken, userCon.getAnUser);

router.put("/update/:id", middlewareCon.verifyTokenAndAdminAuth(["admin"]), userCon.updateUser);

router.put("/changepassword/:id", middlewareCon.verifyToken, userCon.changePassword);

module.exports = router;

