const status = require("../models/status");

const statusCon = {
  // thêm trạng thái
  addStatus: async (req, res) => {
    try {
      const newStatus = new status(req.body);
      const saveStatus = await newStatus.save();
      res.status(200).json(saveStatus);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả trạng thái
  getAllStatus: async (req, res) => {
    try {
      const statuss = await status.find()
      res.status(200).json(statuss);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy trạng thái theo ID
  getAnStatus: async (req, res) => {
    try {
      const statusData = await status.findById(req.params.id);
      res.status(200).json(statusData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật trạng thái
  updateStatus: async (req, res) => {
    try {
      const statusToUpdate = await status.findById(req.params.id);
      await statusToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa trạng thái
  deleteStatus: async (req, res) => {
    try {
      await status.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = statusCon;
