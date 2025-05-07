const { phong } = require("../model/model");

const phongCon = {
  // Thêm phòng mới
  addPhong: async (req, res) => {
    try {
      const newPhong = new phong(req.body);
      const savedPhong = await newPhong.save();
      res.status(200).json(savedPhong);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Lấy tất cả phòng
  getAllPhong: async (req, res) => {
    try {
      let limit = parseInt(req.query.limit) || 50;
      const phongs = await phong.find().limit(limit);
      res.status(200).json(phongs);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Lấy một phòng theo ID
  getPhongById: async (req, res) => {
    try {
      const foundPhong = await phong.findById(req.params.id);
      res.status(200).json(foundPhong);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Cập nhật phòng
  updatePhong: async (req, res) => {
    try {
      const phongToUpdate = await phong.findById(req.params.id);
      await phongToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật phòng thành công!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // Xóa phòng
  deletePhong: async (req, res) => {
    try {
      await phong.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa phòng thành công!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = phongCon;
