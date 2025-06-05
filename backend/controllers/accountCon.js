const User = require("../models/userModel");
const Employee = require("../models/employeeModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
const accountCon = {
  // === TẠO TOKEN VÀ REFRESH TOKEN ===
  creareToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        role: user.role || "user",
      },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );
  },
  creareRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user._id,
        role: user.role || "user",
      },
      process.env.REFRESH_TOKEN,
      { expiresIn: "20d" }
    );
  },

  // ====== KIỂM TRA CÁC ĐIỀU KIỆN USER =====
  validateUser: async (userData, userId) => {
    const { email, password, first_name, last_name, phone_number, address } =
      userData;

    // Kiểm tra các trường bắt buộc
    if (!email || !password || !phone_number) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin người dùng.",
      };
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Email không hợp lệ." };
    }

    // Kiểm tra độ dài chuỗi
    if (
      first_name.length > 100 ||
      last_name.length > 100 ||
      address.length > 255
    ) {
      return { valid: false, message: "Tên hoặc địa chỉ quá dài." };
    }

    // Kiểm tra trùng email
    const existing = await User.findOne({ email });
    if (
      existing &&
      (!userId || existing._id.toString() !== userId.toString())
    ) {
      return { valid: false, message: "Email đã tồn tại." };
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^\d{10}$/; // Giả sử số điện thoại có 10 chữ số
    if (!phoneRegex.test(phone_number)) {
      return { valid: false, message: "Số điện thoại không hợp lệ." };
    }

    return { valid: true };
  },

  // ====== THÊM TÀI KHOẢN USER =====
  addUserAccount: async (req, res) => {
    try {
      const checkAccount = new User(req.body);
      console.log(req.body);
      const validation = await accountCon.validateUser(checkAccount);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      // Mã hoá mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      // Tạo một instance mới của userModel
      const newAccountToSave = new User({
        email: req.body.email,
        password: hashPassword,
      });
      // Lưu vào database bằng hàm save()
      const savedAccount = await newAccountToSave.save();
      const { password, ...accountData } = savedAccount._doc;
      res.status(200).json({
        message: "Tạo tài khoản thành công",
        data: accountData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== THÊM TÀI KHOẢN QUẢN TRỊ VIÊN =====
  addAuthAccount: async (req, res) => {
    try {
      if (req.body.secret_key !== process.env.ADMIN_SECRET_KEY) {
        return res.status(403).json("Bạn không có quyền tạo admin");
      }

      const checkAccount = await Employee.findOne({
        email: req.body.email,
      });
      if (checkAccount) {
        return res.status(400).json("Email admin đã tồn tại");
      }

      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const newAccount = new Employee({
        email: req.body.email,
        password: hashPassword,
      });
      const savedAccount = await newAccount.save();
      const { password, ...accountData } = savedAccount._doc;
      res.status(200).json({
        message: "Tạo tài khoản admin thành công",
        data: accountData,
      });
    } catch (error) {
      res.status(500).json(error.message);
    }
  },

  // ====== ĐĂNG NHẬP USER =====
  loginUser: async (req, res) => {
    try {
      const checkUser = await User.findOne({ email: req.body.email });
      if (!checkUser) return res.status(400).json("Email không tồn tại");

      if (!checkUser.status) {
        return res
          .status(403)
          .json("Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt");
      }

      const isMatch = bcrypt.compare(req.body.password, checkUser.password);
      if (!isMatch) return res.status(400).json("Sai mật khẩu");
      if (checkUser && isMatch) {
        const accessToken = accountCon.creareToken(checkUser);
        const refreshToken = accountCon.creareRefreshToken(checkUser);

        const { password, ...others } = checkUser._doc;
        res.status(200).json({
          message: "Đăng nhập thành công",
          data: { ...others, accessToken, refreshToken },
        });
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== ĐĂNG NHẬP QUẢN TRỊ VIÊN =====
  loginAuth: async (req, res) => {
    try {
      const admin = await Employee.findOne({ email: req.body.email });
      if (!admin) return res.status(400).json("Admin không tồn tại");

      if (!admin.status) {
        return res
          .status(403)
          .json("Tài khoản của bạn đã bị khóa hoặc chưa kích hoạt");
      }

      const isMatch = bcrypt.compare(req.body.password, admin.password);
      if (!isMatch) return res.status(400).json("Sai mật khẩu");

      const accessToken = accountCon.creareToken(admin);
      const refreshToken = accountCon.creareRefreshToken(admin);
      const { password, ...others } = admin._doc;

      res.status(200).json({
        message: "Đăng nhập thành công",
        data: { ...others, accessToken, refreshToken },
      });
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

      res.status(200).json({
        message: "Cấp token mới thành công",
        data: { accessToken: newAccessToken, refreshToken: newRefreshToken },
      });
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
