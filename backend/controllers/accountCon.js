const userModel = require("../models/userModel");
const employersModel = require("../models/employersModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const accountCon = {
  creareToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "30s" }
    );
  },
  creareRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "20d" }
    );
  },

  // ====== THÊM TÀI KHOẢN USER =====
  addUserAccount: async (req, res) => {
    try {
      const checkAccount = await userModel.findOne({
        Email: req.body.email,
      });
      if (checkAccount) {
        return res.status(400).json("Email đã tồn tại");
      }
      // Mã hoá mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      // Tạo một instance mới của userModel
      const newAccount = new userModel({
        Email: req.body.email,
        MatKhau: hashPassword,
      });
      // Lưu vào database bằng hàm save()
      const savedAccount = await newAccount.save();
      res.status(200).json(savedAccount);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== THÊM TÀI KHOẢN ADMIN =====
  addAdminAccount: async (req, res) => {
    try {
      if (req.body.secretKey !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json("Bạn không có quyền tạo admin");
      }

      const checkAccount = await employersModel.findOne({
        Email: req.body.email,
      });
      if (checkAccount) {
        return res.status(400).json("Email admin đã tồn tại");
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newAccount = new employersModel({
        Email: req.body.email,
        MatKhau: hashPassword,
      });
      const savedAccount = await newAccount.save();
      res.status(200).json(savedAccount);
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // ====== ĐĂNG NHẬP USER =====
  loginUser: async (req, res) => {
    try {
      const checkUser = await userModel.findOne({ Email: req.body.email });
      if (!checkUser) {
        return res.status(400).json("Email không tồn tại");
      }

      const isMatch = await bcrypt.compare(
        req.body.password,
        checkUser.MatKhau
      );
      if (!isMatch) {
        return res.status(400).json("Sai mật khẩu");
      }
      if (checkUser && isMatch) {
        const accessToken = accountCon.creareToken(checkUser);
        const refreshToken = accountCon.creareRefreshToken(checkUser);

        const { MatKhau , ...others } = checkUser._doc;
        res.status(200).json({ ...others, accessToken, refreshToken });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== ĐĂNG NHẬP ADMIN =====
  loginAdmin: async (req, res) => {
    try {
      const admin = await employersModel.findOne({ Email: req.body.email });
      if (!admin) return res.status(400).json("Admin không tồn tại");

      const isMatch = await bcrypt.compare(req.body.password, admin.MatKhau);
      if (!isMatch) return res.status(400).json("Sai mật khẩu");

      const accessToken = accountCon.creareToken(admin);
      const refreshToken = accountCon.creareRefreshToken(admin);
      const { MatKhau, ...others } = admin._doc;

      res.status(200).json({ ...others, accessToken, refreshToken });
    } catch (err) {
      res.status(500).json(err.message);
    }
  },

  // ====== LẤY TOKEN MỚI =====
  requestRefreshToken: async (req, res) => {
    // Kiểm tra xem refreshToken có trong body không
    let { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json("Không có token");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, user) => {
      if (err) {
        return res.status(403).json("Lỗi xác thực token");
      }

      // Tạo accessToken và refreshToken mới
      const newAccessToken = accountCon.creareToken(user);
      const newRefreshToken = accountCon.creareRefreshToken(user);

      res
        .status(200)
        .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    });
  },

  // ====== ĐĂNG XUẤT =====
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    refreshTokens = refreshTokens.filter(
      (token) => token !== req.cookies.refreshToken
    );
    res.status(200).json("Đăng xuất thành công");
  },
};
module.exports = accountCon;
