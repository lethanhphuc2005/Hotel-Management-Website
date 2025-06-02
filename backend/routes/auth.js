const router = require("express").Router();
const accountCon = require("../controllers/accountCon");
const middlewareCon = require("../controllers/middlewareCon");

// ADMIN
router.post("/register", middlewareCon.authorizeRoles("admin"), accountCon.addAdminAccount);
router.post("/login", accountCon.loginAdmin);

module.exports = router;