const ContentType = require("../models/contentTypeModel");
const WebsiteContent = require("../models/websiteContentModel");

const contentTypeCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN LOẠI NỘI DUNG ===
  validateContentType: async (contentTypeData, contentTypeId) => {
    const { name, description } = contentTypeData;
    // Kiểm tra các trường bắt buộc
    if (!name || !description) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại nội dung.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (name.length > 100 || description.length > 255) {
      return { valid: false, message: "Tên hoặc mô tả loại nội dung quá dài." };
    }
    // Kiểm tra trùng tên
    const existing = await ContentType.findOne({ name });
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
        sort = "createdAt",
        order = "desc",
        status, // Thêm tham số lọc trạng thái
      } = req.query;

      // Tạo bộ lọc tìm kiếm
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      // Lọc theo trạng thái nếu có
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }

      // Sắp xếp
      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contentTypes, total] = await Promise.all([
        ContentType.find(query)
          .populate("website_content_list")
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        ContentType.countDocuments(query),
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
        sort = "createdAt",
        order = "desc",
      } = req.query;

      // Tạo bộ lọc tìm kiếm
      const query = { status: true };
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [contentTypes, total] = await Promise.all([
        ContentType.find(query)
          .select("-status -createdAt -updatedAt") // Loại bỏ các trường không cần thiết
          .populate({
            path: "website_content_list",
            match: { status: true },
            select: "-status -createdAt -updatedAt",
          })
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        ContentType.countDocuments(query),
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
      const contentType = await ContentType.findById(req.params.id)
        .populate("website_content_list")
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
      const newContentType = new ContentType(req.body);
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
      const contentTypeToUpdate = await ContentType.findById(req.params.id);
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
      const contentTypeToDelete = await ContentType.findById(req.params.id);
      if (!contentTypeToDelete) {
        return res
          .status(404)
          .json({ message: "Loại nội dung không tồn tại." });
      }

      // Kiểm tra xem loại nội dung có nội dung liên quan không
      const relatedContents = await WebsiteContent.find({
        content_type_id: req.params.id,
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
