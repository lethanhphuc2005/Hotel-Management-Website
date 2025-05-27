const websiteContent = require("../models/websiteContentModel");

const websiteContentCon = {
  // thêm nội dung website
  addWebsiteContent: async (req, res) => {
    try {
      const newWebsiteContent = new websiteContent(req.body);
      const saveWebsiteContent = await newWebsiteContent.save();
      res.status(200).json(saveWebsiteContent);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy tất cả nội dung website
  getAllWebsiteContent: async (req, res) => {
    try {
      const websiteContents = await websiteContent.find()
      res.status(200).json(websiteContents);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // lấy nội dung website theo ID
  getAWebsiteContent: async (req, res) => {
    try {
      const websiteContentData = await websiteContent.findById(req.params.id);
      res.status(200).json(websiteContentData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // cập nhật nội dung website
  updateWebsiteContent: async (req, res) => {
    try {
      const websiteContentToUpdate = await websiteContent.findById(req.params.id);
      await websiteContentToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // xóa nội dung website
  deleteWebsiteContent: async (req, res) => {
    try {
      await websiteContent.findByIdAndDelete(req.params.id);
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = websiteContentCon;
