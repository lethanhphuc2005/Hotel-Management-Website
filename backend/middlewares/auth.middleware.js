const jwt = require("jsonwebtoken");

const authMiddleware = {
  // === XÁC THỰC TOKEN ===
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
      res.status(500).json("Đã xảy ra lỗi khi xác thực token: " + error);
    }
  },

  // === XÁC THỰC TOKEN CHO ADMIN ===
  authorizeRoles: (...roles) => {
    return (req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        if (roles.includes(req.user.role)) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền truy cập.");
        }
      });
    };
  },

  // === XÁC THỰC TOKEN CHO USER ===
  authorizeSelfOnly: () => {
    return (req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        const user = req.user;
        if (
          (user.id && user.id === req.params.id) ||
          user.id === req.body.user_id
        ) {
          next();
        } else {
          res.status(403).json("Chỉ chủ tài khoản mới được thao tác.");
        }
      });
    };
  },

  // === XÁC THỰC BÌNH LUẬN CHO USER HOẶC NHÂN VIÊN ===
  authorizeCommentAndReview: () => {
    return (req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        const user = req.user;
        // Kiểm tra xem người dùng có phải là người tạo bình luận hoặc nhân viên liên quan không

        if (!req.body.user_id && !req.body.employee_id) {
          return res
            .status(400)
            .json("Thiếu thông tin người dùng hoặc nhân viên.");
        }

        // Kiểm tra xem người dùng có phải là người tạo bình luận hoặc nhân viên liên quan không
        if (user.id === req.body.user_id || user.id === req.body.employee_id) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền thực hiện hành động này.");
        }
      });
    };
  },

  // === XÁC THỰC TOKEN CHO USER VÀ CÁC QUYỀN NHẤT ĐỊNH ===
  authorizeSelfOrRoles: (...roles) => {
    return (req, res, next) => {
      authMiddleware.verifyToken(req, res, () => {
        const user = req.user;

        if (
          user.id === req.params.id ||
          user.id === req.body.user_id ||
          user.id === req.body.employee_id ||
          roles.includes(user.role)
        ) {
          next();
        } else {
          res.status(403).json("Bạn không có quyền thực hiện hành động này.");
        }
      });
    };
  },
};

module.exports = authMiddleware;
