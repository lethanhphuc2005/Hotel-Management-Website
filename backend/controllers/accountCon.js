//chèn multer để upload file
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const checkfile = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
    return cb(new Error("Bạn chỉ được upload file ảnh"));
  }
  return cb(null, true);
};
const upload = multer({ storage: storage, fileFilter: checkfile });

const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = [
  upload.single("img"),
  async (req, res) => {
    try {
      // Kiểm tra email đã tồn tại chưa bằng hàm findOne()
      const checkuser = await userModel.findOne({
        Email: req.body.email,
      });
      if (checkuser) {
        throw new Error("Email đã tồn tại");
      }
      // Mã hoá mật khẩu bằng bcrypt
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      // Tạo một instance mới của userModel
      const newUser = new userModel({
        Email: req.body.email,
        Password: hashPassword,
      });
      // Lưu vào database bằng hàm save()
      const data = await newUser.save();
      res.json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

const login = [
  upload.single("img"),
  async (req, res) => {
    try {
      console.log(req.body);
      // Kiểm tra email có tồn tại ko
      const checkuser = await userModel.findOne({
        Email: req.body.email,
      });
      if (!checkuser) {
        throw new Error("Email không tồn tại");
      }
      // So sánh mật khẩu
      const isMatch = await bcrypt.compare(
        req.body.password,
        checkuser.Password
      );
      if (!isMatch) {
        throw new Error("Mật khẩu không đúng");
      }
      // Tạo token với mã bí mật là 'secretkey' và thời gian sống là 1 giờ
      const token = jwt.sign({ id: checkuser._id }, "motconcamapbichetduoi", {
        expiresIn: "1h",
      });
      res.json(token);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },
];

// Bảo mật token
const verifyToken = (req, res, next) => {
  // Lấy token từ header
  const token = req.headers.authorization.slice(7);
  console.log(token);
  if (!token) {
    return res.status(403).json({ message: "Không có token" });
  }
  // Xác thực token với mã bí mật
  jwt.verify(token, "motconcamapbichetduoi", (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token đã hết hạn" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Token không hợp lệ" });
      }
      return res.status(401).json({ message: "Lỗi xác thực token" });
    }
    // decoded chứa thông tin user đã mã hoá trong token và lưu vào req
    req.userId = decoded.id;
    next();
  });
};

// Xác thực admin
const verifyAdmin = async (req, res, next) => {
  try {
    //Lấy thông tin user từ id lưu trong req khi đã xác thực token
    const user = await userModel.findById(req.userId);
    if (!user) {
      throw new Error("Không tìm thấy user");
    }
    if (user.role !== "admin") {
      throw new Error("Không có quyền truy cập");
    }
    next();
  } catch {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  verifyToken,
  verifyAdmin,
};
