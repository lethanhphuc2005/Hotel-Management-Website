const jwt = require("jsonwebtoken");

const middlewareCon = {
  verifyToken: (req, res, next) => {
    try {
      const token =
        req.headers.authorization?.split(" ")[1] ||
        req.cookies?.accessToken ||
        req.query?.token;

      if (!token) return res.status(401).json("Chưa được xác thực.");

      jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return res.status(403).json("Token đã hết hạn.");
          }
          if (err.name === "JsonWebTokenError") {
            return res.status(403).json("Token không hợp lệ.");
          }
          return res.status(403).json("Xác thực thất bại.");
        }
        req.user = user;
        next();
      });
    } catch (error) {
      res.status(500).json("Lỗi xác thực.");
    }
  },

  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      middlewareCon.verifyToken(req, res, () => {
        if (roles.includes(req.user.role)) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền truy cập.");
        }
      });
    };
  },

  authorizeSelfOnly: () => {
    return (req, res, next) => {
      middlewareCon.verifyToken(req, res, () => {
        if (req.user.id === req.params.id) {
          next();
        } else {
          res.status(403).json("Chỉ chủ tài khoản mới được thao tác.");
        }
      });
    };
  },

  authorizeSelfOrRoles: (...roles) => {
    return (req, res, next) => {
      middlewareCon.verifyToken(req, res, () => {
        const user = req.user;
        if (user.id === req.params.id || roles.includes(user.role)) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền thực hiện hành động này.");
        }
      });
    };
  },
};

module.exports = middlewareCon;
