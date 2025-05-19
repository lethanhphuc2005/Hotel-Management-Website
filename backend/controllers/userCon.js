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

// Lấy thông tin user khi có token
const getAnUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.userId, { password: 0 });
    if (!user) {
      throw new Error("Không tìm thấy user");
    }
    res.status(200).json(user);
  } catch {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const arr = await userModel.find();
    res.status(200).json(arr);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.userId;
    const { password, newPassword } = req.body;
    console.log(password, newPassword);

    if (!password || !newPassword) {
      return res.status(400).json({ message: "Missing password fields" });
    }
    const user = await userModel.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.updateOne({ $set: { Password: hashedPassword } });

    res.status(200).json("Đổi mật khẩu thành công!");
  } catch (err) {
    res
      .status(500)
      .json({ message: "Đổi mật khẩu không thành công", error: err });
  }
};

const updateUser = [
  upload.single("img"),
  async (req, res) => {
    try {
      const userToUpdate = await userModel.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).json({ message: "User not found" });
      }
      await userToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
];

module.exports = {
  getAllUsers,
  getAnUser,
  updateUser,
  changePassword,
};
