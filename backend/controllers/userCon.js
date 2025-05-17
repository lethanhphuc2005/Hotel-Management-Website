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

const userModel = require("../model/userModel");

// Lấy thông tin user khi có token
const getAnUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
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
};
