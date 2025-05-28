const {
  websiteContentModel,
  contentTypeModel,
} = require("../models/websiteContentModel");

const contentTypeCon = {
  // Kiểm tra loại nội dung
  validateContentType: async (contentTypeData, contentTypeId) => {
    const { TenND, MoTa } = contentTypeData;
    // Kiểm tra các trường bắt buộc
    if (!TenND || !MoTa) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại nội dung.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (TenND.length > 100 || MoTa.length > 255) {
      return { valid: false, message: "Tên hoặc mô tả loại nội dung quá dài." };
    }
    // Kiểm tra trùng tên
    const existing = await contentTypeModel.findOne({ TenND });
    if (
      existing &&
      (!contentTypeId || existing._id.toString() !== contentTypeId.toString())
    ) {
      return { valid: false, message: "Tên loại nội dung đã tồn tại." };
    }
    return { valid: true };
  },

  // Thêm loại nội dung
  addContentType: async (req, res) => {
    try {
      const newContentType = new contentTypeModel(req.body);
      // Validate content type data
      const validation = await contentTypeCon.validateContentType(
        newContentType
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const saveContentType = await newContentType.save();
      res.status(200).json(saveContentType);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Lấy tất cả loại nội dung
  getAllContentTypes: async (req, res) => {
    try {
      const contentTypes = await contentTypeModel
        .find()
        .populate("DanhSachNoiDungWebsite")
        .exec();
      if (!contentTypes || contentTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại nội dung nào được tìm thấy." });
      }
      res.status(200).json(contentTypes);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Lấy loại nội dung theo ID
  getOneContentType: async (req, res) => {
    try {
      const contentType = await contentTypeModel
        .findById(req.params.id)
        .populate("DanhSachNoiDungWebsite")
        .exec();
      if (!contentType) {
        return res
          .status(404)
          .json({ message: "Loại nội dung không tồn tại." });
      }
      res.status(200).json(contentType);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Cập nhật loại nội dung
  updateContentType: async (req, res) => {
    try {
      const contentTypeToUpdate = await contentTypeModel.findById(
        req.params.id
      );
      if (!contentTypeToUpdate) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? contentTypeToUpdate.toObject()
          : { ...contentTypeToUpdate.toObject(), ...req.body };

      // Validate dữ liệu cập nhật
      const validation = await contentTypeCon.validateContentType(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật nội dung website
      await contentTypeToUpdate.updateOne({ $set: req.body });
      res.status(200).json("Cập nhật thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Xóa loại nội dung
  deleteContentType: async (req, res) => {
    try {
      const contentTypeToDelete = await contentTypeModel.findById(
        req.params.id
      );
      if (!contentTypeToDelete) {
        return res
          .status(404)
          .json({ message: "Loại nội dung không tồn tại." });
      }

      // Kiểm tra xem loại nội dung có nội dung liên quan không
      const relatedContents = await websiteContentModel.find({
        MaND: req.params.id,
      });
      if (relatedContents.length > 0) {
        return res.status(400).json({
          message: "Không thể xóa loại nội dung vì có nội dung liên quan.",
        });
      }

      await contentTypeToDelete.deleteOne();
      res.status(200).json("Xóa loại nội dung thành công !!!");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = contentTypeCon;
