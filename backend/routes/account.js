const router = require("express").Router();

const accountCon = require("../controllers/accountCon");
const middlewareCon = require("../controllers/middlewareCon");

router.post("/register/", accountCon.addUserAccount);
router.post("/login/", accountCon.loginUser);

router.post("/refresh", accountCon.requestRefreshToken);
router.post("/logout", middlewareCon.verifyToken, accountCon.logout);

module.exports = router;
