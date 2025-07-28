const UserFavorite = require("../models/userFavorite.model");
const User = require("../models/user.model");
const RoomClass = require("../models/roomClass.model");

const userFavoriteController = {
  validateUserFavorite: async (favoriteData) => {
    const { user_id, room_class_id } = favoriteData;

    if (!user_id || !room_class_id) {
      return {
        valid: false,
        message: "user_id và room_class_id là bắt buộc",
      };
    }

    const user = await User.findById(user_id).select("_id name").lean();
    if (!user) {
      return {
        valid: false,
        message: "Người dùng không tồn tại",
      };
    }

    const roomClass = await RoomClass.findById(room_class_id)
      .select("_id name")
      .lean();
    if (!roomClass) {
      return {
        valid: false,
        message: "Loại phòng không tồn tại",
      };
    }

    return { valid: true };
  },

  addFavorite: async (req, res) => {
    try {
      const favoriteData = new UserFavorite(req.body);
      const validate = await userFavoriteController.validateUserFavorite(
        favoriteData
      );
      if (!validate.valid) {
        return res.status(400).json({ message: validate.message });
      }

      const existingFavorite = await UserFavorite.findOne({
        user_id: favoriteData.user_id,
        room_class_id: favoriteData.room_class_id,
      }).lean();
      if (existingFavorite) {
        return res.status(400).json({
          message: "Yêu thích đã tồn tại",
        });
      }
      const newFavorite = await favoriteData.save();
      if (!newFavorite) {
        return res.status(500).json({ message: "Không thể thêm yêu thích" });
      }

      res.status(201).json({
        message: "Thêm yêu thích thành công",
        data: newFavorite,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getFavoritesByUserId: async (req, res) => {
    try {
      const userId = req.params.id;
      const favorites = await UserFavorite.find({ user_id: userId }).populate(
        "room_class user"
      );

      res.status(200).json({
        message: "Lấy danh sách yêu thích thành công",
        data: favorites,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  deleteFavorite: async (req, res) => {
    try {
      const favoriteId = req.params.id;
      const deletedFavorite = await UserFavorite.findById(favoriteId);
      if (!deletedFavorite) {
        return res.status(404).json({ message: "Yêu thích không tồn tại" });
      }
      const result = await UserFavorite.deleteOne({ _id: favoriteId });
      if (result.deletedCount === 0) {
        return res.status(500).json({ message: "Không thể xóa yêu thích" });
      }
      res.status(200).json({
        message: "Xóa yêu thích thành công",
        data: deletedFavorite,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = userFavoriteController;
