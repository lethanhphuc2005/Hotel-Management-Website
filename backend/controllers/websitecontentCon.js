const {
  websiteContentModel,
  contentTypeModel,
} = require("../models/websiteContentModel");

const websiteContentCon = {
  // === KIỂM TRA NỘI DUNG WEBSITE ===
  validateWebsiteContent: async (websiteContentData, websiteContentId) => {
    const { TieuDe, NoiDung, MaND, HinhAnh } = websiteContentData;
    // Kiểm tra các trường bắt buộc
    if (!TieuDe || !NoiDung || !MaND || !HinhAnh) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin nội dung website.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (TieuDe.length > 100 || NoiDung.length > 5000 || HinhAnh.length > 255) {
      return {
        valid: false,
        message: "Độ dài tiêu đề, nội dung hoặc hình ảnh không hợp lệ.",
      };
    }
    // Kiểm tra trùng tiêu đề
    const existing = await websiteContentModel.findOne({ TieuDe });
    if (
      existing &&
      (!websiteContentId ||
        existing._id.toString() !== websiteContentId.toString())
    ) {
      return { valid: false, message: "Tiêu đề nội dung đã tồn tại." };
    }
    // Kiểm tra MaND có tồn tại trong loại nội dung không
    const contentTypeExists = await contentTypeModel.findById(MaND).exec();
    if (!contentTypeExists) {
      return { valid: false, message: "Mã loại nội dung không hợp lệ." };
    }

    return { valid: true };
  },

  // === THÊM NỘI DUNG WEBSITE ===
  addWebsiteContent: async (req, res) => {
    try {
      const newWebsiteContent = new websiteContentModel(req.body);
      // Validate website content data
      const validation = await websiteContentCon.validateWebsiteContent(
        newWebsiteContent
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const saveWebsiteContent = await newWebsiteContent.save();
      res.status(200).json(saveWebsiteContent);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ NỘI DUNG WEBSITE ===
  getAllWebsiteContents: async (req, res) => {
    try {
      const websiteContents = await websiteContentModel
        .find()
        .populate("LoaiNoiDung") // populate theo virtual field
        .exec();

      if (!websiteContents || websiteContents.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có nội dung website nào." });
      }

      res.status(200).json(websiteContents);
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // === LẤY NỘI DUNG WEBSITE THEO ID ===
  getOneWebsiteContent: async (req, res) => {
    try {
      const websiteContentData = await websiteContentModel
        .findById(req.params.id)
        .populate("LoaiNoiDung") // populate theo virtual field
        .exec();

      if (!websiteContentData) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      }

      res.status(200).json(websiteContentData);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT NỘI DUNG WEBSITE ===
  updateWebsiteContent: async (req, res) => {
    try {
      const websiteContentToUpdate = await websiteContentModel.findById(
        req.params.id
      );
      if (!websiteContentToUpdate) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? websiteContentToUpdate.toObject()
          : { ...websiteContentToUpdate.toObject(), ...req.body };

      // Validate dữ liệu cập nhật
      const validation = await websiteContentCon.validateWebsiteContent(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật nội dung website
      await websiteContentToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA NỘI DUNG WEBSITE ===
  deleteWebsiteContent: async (req, res) => {
    try {
      const websiteContent = await websiteContentModel.findById(req.params.id);
      if (!websiteContent) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      } else if (websiteContent.TrangThai) {
        return res
          .status(400)
          .json({ message: "Không thể xóa nội dung đã được đăng." });
      }

      await websiteContent.deleteOne();
      res.status(200).json("Xóa thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = websiteContentCon;
