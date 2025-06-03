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
  // ====== LẤY TẤT CẢ USER (có phân trang, sắp xếp, lọc trạng thái) =====
  getAllUsers: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        status,
      } = req.query;

      const query = {};
      // Tạo bộ lọc tìm kiếm
      if (search) {
        query.$or = [
          { TenKH: { $regex: search, $options: "i" } },
          { Email: { $regex: search, $options: "i" } },
          { SDT: { $regex: search, $options: "i" } },
          { DiaChi: { $regex: search, $options: "i" } },
          { YeuCau_DB: { $regex: search, $options: "i" } },
        ];
      }
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) {
          query.TrangThai = true;
        } else if (status === "false" || status === false) {
          query.TrangThai = false;
        }
      }

      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      const users = await userModel
        .find(query)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      const total = await userModel.countDocuments(query);

      if (!users || users.length === 0) {
        return res.status(404).json("Không tìm thấy user nào");
      }
      res.status(200).json({
        message: "Lấy tất cả user thành công",
        data: users,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ==== LẤY USER THEO ID ====
  getUserById: async (req, res) => {
    try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json("Không tìm thấy user");
      }
      res.status(200).json({
        message: "Lấy user thành công",
        data: user,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === ĐỔI MẬT KHẨU ===
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

      res.status(200).json({
        message: "Đổi mật khẩu thành công",
        data: { userId: user._id },
      });
    } catch (err) {
      res
        .status(500)
        .json({ message: "Đổi mật khẩu không thành công", error: err });
    }
  },

  // === CẬP NHẬT USER ===
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
        res.status(200).json({
          message: "Cập nhật user thành công",
          data: updatedData,
        });
      } catch (error) {
        res.status(500).json(error);
      }
    },
  ],

  // === XOÁ USER ===
  // deleteUser: async (req, res) => {
  //   try {
  //     const userToDelete = await userModel.findById(req.params.id);
  //     if (!userToDelete) {
  //       return res.status(404).json("Không tìm thấy user để xóa");
  //     } else if (userToDelete.TrangThai === true) {
  //       return res.status(400).json("Không thể xóa user đang hoạt động");
  //     } else if (userToDelete.TrangThai === false) {
  //       return res.status(400).json("User đã bị xóa trước đó");
  //     }
  //     await userModel.findByIdAndDelete(req.params.id);

  //     res.status(200).json({
  //       message: "Xóa user thành công ",
  //       data: { userId: user._id },
  //     });
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
};

module.exports = userCon;
