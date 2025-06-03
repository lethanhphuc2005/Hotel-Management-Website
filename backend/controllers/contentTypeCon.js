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

  // === LẤY TẤT CẢ LOẠI NỘI DUNG (CÓ TÌM KIẾM, PHÂN TRANG, SẮP XẾP, SẮP XẾP THEO TRẠNG THÁI) ===
  getAllContentTypes: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "_id",
        order = "desc",
        status, // Thêm tham số lọc trạng thái
      } = req.query;

      // Tạo bộ lọc tìm kiếm
      const query = {};
      if (search) {
        query.$or = [
          { TenND: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }
      // Lọc theo trạng thái nếu có
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.TrangThai = true;
        else if (status === "false" || status === false)
          query.TrangThai = false;
      }

      // Sắp xếp
      const sortOption = {};
      // Nếu sort là 'TrangThai', sắp xếp theo trạng thái
      if (sort === "TrangThai") {
        sortOption.TrangThai = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contentTypes, total] = await Promise.all([
        contentTypeModel
          .find(query)
          .populate("DanhSachNoiDungWebsite")
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        contentTypeModel.countDocuments(query),
      ]);

      if (!contentTypes || contentTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại nội dung nào được tìm thấy." });
      }
      res.status(200).json({
        message: "Lấy tất cả loại nội dung thành công",
        data: contentTypes,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ LOẠI NỘI DUNG CHO USER ===
  getAllContentTypesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "_id",
        order = "desc",
      } = req.query;

      // Tạo bộ lọc tìm kiếm
      const query = { TrangThai: true };
      if (search) {
        query.$or = [
          { TenND: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contentTypes, total] = await Promise.all([
        contentTypeModel
          .find(query)
          .select("-TrangThai") // Không trả về trường TrangThai cho người dùng
          .populate({
            path: "DanhSachNoiDungWebsite",
            match: { TrangThai: true }, // Chỉ lấy nội dung đang hoạt động
            select: "-TrangThai", // Không trả về trường TrangThai của nội dung
          })
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        contentTypeModel.countDocuments(query),
      ]);

      if (!contentTypes || contentTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại nội dung nào được tìm thấy." });
      }
      res.status(200).json({
        message: "Lấy tất cả loại nội dung thành công",
        data: contentTypes,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY LOẠI NỘI DUNG THEO ID ===
  getContentTypeById: async (req, res) => {
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
