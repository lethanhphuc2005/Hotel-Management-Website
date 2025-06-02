const ImageModel = require("../models/imageModel");

const imgRoomTypeCon = {
  // thêm hình ảnh loại phòng
  addImgRoomType: async (req, res) => {
    try {
      const newimgRoomType = new ImageModel(req.body);
      const saveimgRoomType = await newimgRoomType.save();
      res.status(200).json(saveimgRoomType);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả hình ảnh loại phòng
  getAllimgRoomType: async (req, res) => {
    try {
      const imgRoomTypes = await ImageModel.find();
      res.status(200).json(imgRoomTypes);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy hình ảnh loại phòng theo ID
  getAnimgRoomType: async (req, res) => {
    try {
      const imgRoomTypeData = await ImageModel.findById(req.params.id);
      res.status(200).json(imgRoomTypeData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật hình ảnh loại phòng
  updateimgRoomType: async (req, res) => {
    try {
      const imgRoomTypeToUpdate = await ImageModel.findById(req.params.id);
      await imgRoomTypeToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa hình ảnh loại phòng
  deleteimgRoomType: async (req, res) => {
    try {
      await ImageModel.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = imgRoomTypeCon;
