const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({
    message: "Test route is working",
    backendUrl: process.env.BACKEND_URL,
    frontendUrl: process.env.FRONTEND_URL,
    adminUrl: process.env.ADMIN_URL,
  });
});


module.exports = router;