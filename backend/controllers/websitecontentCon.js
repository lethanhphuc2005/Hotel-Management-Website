const websitecontent = require("../model/websitecontentModel");

const websitecontentCon = {
  // thêm nội dung website
  addWebsitecontent: async (req, res) => {
    try {
      const newWebsitecontent = new websitecontent(req.body);
      const saveWebsitecontent = await newWebsitecontent.save();
      res.status(200).json(saveWebsitecontent);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả nội dung website
  getAllWebsitecontent: async (req, res) => {
    try {
      const websitecontents = await websitecontent.find()
      res.status(200).json(websitecontents);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy nội dung website theo ID
  getAnWebsitecontent: async (req, res) => {
    try {
      const websitecontentData = await websitecontent.findById(req.params.id);
      res.status(200).json(websitecontentData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật nội dung website
  updateWebsitecontent: async (req, res) => {
    try {
      const websitecontentToUpdate = await websitecontent.findById(req.params.id);
      await websitecontentToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa nội dung website
  deleteWebsitecontent: async (req, res) => {
    try {
      await websitecontent.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = websitecontentCon;
