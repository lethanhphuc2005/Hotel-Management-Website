const imgroomtype = require("../model/model");

const imgroomtypeCon = {
  // thêm hình ảnh loại phòng
  addImgroomtype: async (req, res) => {
    try {
      const newImgroomtype = new imgroomtype(req.body);
      const saveImgroomtype = await newImgroomtype.save();
      res.status(200).json(saveImgroomtype);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả hình ảnh loại phòng
  getAllImgroomtype: async (req, res) => {
    try {
      const imgroomtypes = await imgroomtype.find()
      res.status(200).json(imgroomtypes);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy hình ảnh loại phòng theo ID
  getAnImgroomtype: async (req, res) => {
    try {
      const imgroomtypeData = await imgroomtype.findById(req.params.id);
      res.status(200).json(imgroomtypeData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật hình ảnh loại phòng
  updateImgroomtype: async (req, res) => {
    try {
      const imgroomtypeToUpdate = await imgroomtype.findById(req.params.id);
      await imgroomtypeToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa hình ảnh loại phòng
  deleteImgroomtype: async (req, res) => {
    try {
      await imgroomtype.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = imgroomtypeCon;
