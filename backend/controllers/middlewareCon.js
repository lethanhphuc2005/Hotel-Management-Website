const jwt = require("jsonwebtoken");

const middlewareCon = {
  verifyToken: (req, res, next) => {
    const token = req.headers.authorization;

    if (token) {
      const accessToken = token.split(" ")[1];
      jwt.verify(accessToken, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          res.status(403).json("token hết hạn");
        } else {
          req.user = user;
          next();
        }
      });
    } else {
      res.status(401).json("chưa được xác thực");
    }
  },

  // Middleware kiểm tra token và role (admin, manager, hoặc chính chủ)
  verifyTokenAndAdminAuth: (allowedRoles = []) => {
    return (req, res, next) => {
      middlewareCon.verifyToken(req, res, () => {
        const user = req.user;

        // Nếu là chính user hoặc có role được phép
        if (user.id == req.params.id || allowedRoles.includes(user.role)) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền truy cập!");
        }
      });
    };
  }
};

module.exports = middlewareCon;
