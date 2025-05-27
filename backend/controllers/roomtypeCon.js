const { roomtype } = require("../models/model");

const roomtypeCon = {
  // thêm loại phòng
  addRoomtype: async (req, res) => {
    try {
      const newRoomtype = new roomtype(req.body);
      const saveRoomtype = await newRoomtype.save();
      res.status(200).json(saveRoomtype);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả loại phòng
  getAllRoomtype: async (req, res) => {
    try {
      const { TenLP, limit, page } = req.query;
      const query = {}; // chứa các điều kiện tìm kiếm
      const options = {}; // chứa các tùy chọn limit, sort, page,...
      if (TenLP) { // Tìm kiếm theo tên
        query.TenLP = new RegExp(TenLP, 'i');
        // RegExp: biểu thức chính quy
        // 1 không phân biệt chữ hoa chữ thường
      }
      if (limit) { // Giới hạn sản phẩm lấy ra
        options.limit = parseInt(limit);
      }
      if (page) {
        options.skip = (parseInt(page) - 1) * options.limit;
      }
      const roomtypes = await roomtype.find(query, null, options).populate([
        { path: "TienNghi", select: "TenTN MoTa" },
        { path: "HinhAnh", select: "HinhAnh" },
      ]);
      res.status(200).json(roomtypes);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy loại phòng theo ID
  getAnRoomtype: async (req, res) => {
    try {
      const roomtypeData = await roomtype.findById(req.params.id);
      res.status(200).json(roomtypeData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật loại phòng
  updateRoomtype: async (req, res) => {
    try {
      const roomtypeToUpdate = await roomtype.findById(req.params.id);
      await roomtypeToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa loại phòng
  deleteRoomtype: async (req, res) => {
    try {
      await roomtype.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = roomtypeCon;
