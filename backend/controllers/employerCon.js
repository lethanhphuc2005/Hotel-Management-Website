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

const employerModel = require("../models/employerModel");
const bcrypt = require("bcryptjs");

const employerCon = {
  // ====== LẤY TẤT CẢ NHÂN VIÊN =====
  getAllEmployers: async (req, res) => {
    try {
      const users = await employerModel.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== LẤY NHÂN VIÊN THEO ID =====
  getEmployerById: async (req, res) => {
    try {
      const checkUser = await employerModel.findById(req.params.id);
      if (!checkUser) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }
      res.status(200).json(checkUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== ĐỔI MẬT KHẨU NHÂN VIÊN =====
  changePassword: async (req, res) => {
    try {
      const userId = req.params.id;
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu không được để trống" });
      }
      const checkUser = await employerModel.findById(userId);

      if (!checkUser) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }

      const isMatch = await bcrypt.compare(password, checkUser.MatKhau);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await checkUser.updateOne({ $set: { MatKhau: hashedPassword } });

      res.status(200).json("Đổi mật khẩu thành công!");
    } catch (err) {
      res
        .status(500)
        .json({ message: "Đổi mật khẩu không thành công", error: err });
    }
  },

  // ====== CẬP NHẬT THÔNG TIN NHÂN VIÊN =====
  updateEmployer: [
    upload.single("img"),
    async (req, res) => {
      try {
        const checkEmail = await employerModel.findOne({
          Email: req.body.email,
        });
        if (checkEmail && checkEmail._id !== req.params.id) {
          return res.status(400).json("Email đã tồn tại");
        }
        const userToUpdate = await employerModel.findById(req.params.id);
        if (!userToUpdate) {
          return res.status(404).json({ message: "Không tìm thấy nhân viên" });
        }

        await userToUpdate.updateOne({ $set: req.body });
        res.status(200).json("Cập nhật thành công !!!");
      } catch (error) {
        res.status(500).json(error);
      }
    },
  ],

  //   // ====== XOÁ NHÂN VIÊN =====
  // deleteEmployer: async (req, res) => {
  //   try {
  //     const checkUser = await employerModel.findByIdAndDelete(req.params.id);
  //     if (!checkUser) {
  //       return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  //     }
  //     res.status(200).json("Xóa thành công !!!");
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
};

module.exports = employerCon;
