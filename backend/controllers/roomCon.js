const { room } = require("../models/roomModel");

const roomCon = {
  // Thêm phòng mới
  addRoom: async (req, res) => {
    try {
      const newRoom = new room(req.body);
      const savedRoom = await newRoom.save();
      res.status(200).json(savedRoom);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Lấy tất cả phòng
  getAllRoom: async (req, res) => {
    try {
      let limit = parseInt(req.query.limit) || 50;
      const rooms = await room.find().limit(limit).populate({
        path: 'MaLP',
        select: 'TenLP SoGiuong GiaPhong MoTa',
        populate: {
          path: 'TienNghi', // virtual trong roomtype nếu có
        },
      }).populate({
        path: 'TrangThai',
        select: 'TenTT LoaiTT',
      });;
      res.status(200).json(rooms);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Lấy một phòng theo ID
  getRoomById: async (req, res) => {
    try {
      const foundRoom = await room.findById(req.params.id);
      res.status(200).json(foundRoom);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Cập nhật phòng
  updateRoom: async (req, res) => {
    try {
      const roomToUpdate = await room.findById(req.params.id);
      await roomToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật phòng thành công!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Xóa phòng
  deleteRoom: async (req, res) => {
    try {
      await room.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa phòng thành công!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = roomCon;
