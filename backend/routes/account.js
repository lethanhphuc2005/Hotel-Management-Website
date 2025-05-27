const accountCon = require("../controllers/accountCon");
const middlewareCon = require("../controllers/middlewareCon");

const router = require("express").Router();

// USER
router.post("/register/user", accountCon.addUserAccount);
router.post("/login/user", accountCon.loginUser);

// ADMIN
router.post("/register/admin", accountCon.addAdminAccount);
router.post("/login/admin", accountCon.loginAdmin);

// CHUNG
router.post("/refresh", accountCon.requestRefreshToken);
router.post("/logout", middlewareCon.verifyToken, accountCon.logout);

module.exports = router;
