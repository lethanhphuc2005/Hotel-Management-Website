const contentTypeModel = require("../models/contentTypeModel");
const websiteContentModel = require("../models/websiteContentModel");

const contentTypeCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN LOẠI NỘI DUNG ===
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

  // === LẤY TẤT CẢ LOẠI NỘI DUNG ===
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
      res.status(200).json({
        message: "Lấy tất cả loại nội dung thành công",
        data: contentTypes,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ LOẠI NỘI DUNG CHO USER ===
  getAllContentTypesForUser: async (req, res) => {
    try {
      const contentTypes = await contentTypeModel
        .find({ TrangThai: true })
        .select("-TrangThai") // Không trả về trường TrangThai
        .populate({
          path: "DanhSachNoiDungWebsite",
          match: { TrangThai: true }, // Chỉ lấy nội dung có trạng thái true
          select: "-TrangThai", // bỏ trường TrangThai
        })
        .exec();
      if (!contentTypes || contentTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại nội dung nào được tìm thấy." });
      }
      res.status(200).json({
        message: "Lấy tất cả loại nội dung thành công",
        data: contentTypes,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY LOẠI NỘI DUNG THEO ID ===
  getContentTypeByid: async (req, res) => {
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
      res.status(200).json({
        message: "Lấy loại nội dung thành công",
        data: contentType,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM LOẠI NỘI DUNG MỚI ===
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
      res.status(200).json({
        message: "Thêm loại nội dung thành công",
        data: saveContentType,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT LOẠI NỘI DUNG ===
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
      res.status(200).json({
        message: "Cập nhật loại nội dung thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA LOẠI NỘI DUNG ===
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
      res.status(200).json({
        message: "Xóa loại nội dung thành công",
        data: contentTypeToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = contentTypeCon;
