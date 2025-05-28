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
const account = require("./accountCon"); // Assuming you have an account controller for validation

const userCon = {
  // add
  getAllUsers: async (req, res) => {
    try {
      const checkUsers = await userModel.find();
      if (!checkUsers || checkUsers.length === 0) {
        return res.status(404).json("Không tìm thấy user nào");
      }
      res.status(200).json(checkUsers);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userToDelete = await userModel.findById(req.params.id);
      if (!userToDelete) {
        return res.status(404).json("Không tìm thấy user để xóa");
      } else if (userToDelete.TrangThai === true) {
        return res.status(400).json("Không thể xóa user đang hoạt động");
      } else if (userToDelete.TrangThai === false) {
        return res.status(400).json("User đã bị xóa trước đó");
      }
      await userModel.findByIdAndDelete(req.params.id);

      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  getAnUser: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json("Không tìm thấy user");
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  changePassword: async (req, res) => {
    try {
      const userId = req.params.id;
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu không được để trống" });
      }
      const user = await userModel.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy user" });
      }

      const isMatch = bcrypt.compare(password, user.MatKhau);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await user.updateOne({ $set: { MatKhau: hashedPassword } });

      res.status(200).json("Đổi mật khẩu thành công!");
    } catch (err) {
      res
        .status(500)
        .json({ message: "Đổi mật khẩu không thành công", error: err });
    }
  },

  updateUser: [
    upload.single("img"),
    async (req, res) => {
      try {
        const userToUpdate = await userModel.findById(req.params.id);
        if (!userToUpdate) {
          return res.status(404).json({ message: "Không tìm thấy user" });
        }
        // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
        const updatedData =
          Object.keys(req.body).length === 0
            ? userToUpdate.toObject()
            : { ...userToUpdate.toObject(), ...req.body };

        // Validate dữ liệu cập nhật (dùng validateDiscount bạn đã tạo)
        const validation = await account.validateUser(
          updatedData,
          req.params.id
        );

        if (!validation.valid) {
          return res.status(400).json({ message: validation.message });
        }

        await userToUpdate.updateOne({ $set: req.body });
        res.status(200).json("Cập nhật thành công !!!");
      } catch (error) {
        res.status(500).json(error);
      }
    },
  ],
};

module.exports = userCon;
