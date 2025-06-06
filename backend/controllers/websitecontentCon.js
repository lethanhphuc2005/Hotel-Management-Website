const ContentType = require("../models/contentTypeModel");
const WebsiteContent = require("../models/websiteContentModel");

const websiteContentCon = {
  // === KIỂM TRA NỘI DUNG WEBSITE ===
  validateWebsiteContent: async (websiteContentData, websiteContentId) => {
    const { title, content, content_type_id, image } = websiteContentData;
    // Kiểm tra các trường bắt buộc
    if (!title || !content || !content_type_id || !image) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin nội dung website.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (title.length > 100 || content.length > 5000 || image.length > 255) {
      return {
        valid: false,
        message: "Độ dài tiêu đề, nội dung hoặc hình ảnh không hợp lệ.",
      };
    }
    // Kiểm tra trùng tiêu đề
    const existing = await WebsiteContent.findOne({ title });
    if (
      existing &&
      (!websiteContentId ||
        existing._id.toString() !== websiteContentId.toString())
    ) {
      return { valid: false, message: "Tiêu đề nội dung đã tồn tại." };
    }
    // Kiểm tra content_type_id có tồn tại trong loại nội dung không
    const contentTypeExists = await ContentType.findById(
      content_type_id
    ).exec();
    if (!contentTypeExists) {
      return { valid: false, message: "Mã loại nội dung không hợp lệ." };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ NỘI DUNG WEBSITE (CÓ TÌM KIẾM, SẮP XẾP, PHÂN TRANG, TRẠNG THÁI) ===
  getAllWebsiteContents: async (req, res) => {
    try {
      const {
        search = "",
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10,
        status,
      } = req.query;

      const query = {};

      // Tìm kiếm theo tiêu đề (không phân biệt hoa thường)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
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
      sortOption[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [websiteContents, total] = await Promise.all([
        WebsiteContent.find(query)
          .populate("content_type")
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        WebsiteContent.countDocuments(query),
      ]);

      if (!websiteContents || websiteContents.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có nội dung website nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả nội dung website thành công",
        data: websiteContents,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // === LẤY TẤT CẢ NỘI DUNG WEBSITE CHO USER ===
  getAllWebsiteContentsForUser: async (req, res) => {
    try {
      const {
        search = "",
        sort = "createdAt",
        order = "desc",
        page = 1,
        limit = 10,
      } = req.query;

      const query = { status: true }; // Chỉ lấy nội dung đã được đăng

      // Tìm kiếm theo tiêu đề (không phân biệt hoa thường)
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [websiteContents, total] = await Promise.all([
        WebsiteContent.find(query)
          .populate({
            path: "content_type",
            match: { status: true }, // Chỉ lấy loại nội dung đã được đăng
            select: "-status",
          })
          .select("-status")
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        WebsiteContent.countDocuments(query),
      ]);

      if (!websiteContents || websiteContents.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có nội dung website nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả nội dung website thành công",
        data: websiteContents,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // === LẤY NỘI DUNG WEBSITE THEO ID ===
  getWebsiteContentById: async (req, res) => {
    try {
      const websiteContentData = await WebsiteContent.findById(req.params.id)
        .populate("content_type") // populate theo virtual field
        .exec();

      if (!websiteContentData) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      }

      res.status(200).json({
        message: "Lấy nội dung website thành công",
        data: websiteContentData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM NỘI DUNG WEBSITE ===
  addWebsiteContent: async (req, res) => {
    try {
      const newWebsiteContent = new WebsiteContent(req.body);
      // Validate website content data
      const validation = await websiteContentCon.validateWebsiteContent(
        newWebsiteContent
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const saveWebsiteContent = await newWebsiteContent.save();
      res.status(200).json({
        message: "Thêm nội dung website thành công",
        data: saveWebsiteContent,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT NỘI DUNG WEBSITE ===
  updateWebsiteContent: async (req, res) => {
    try {
      const websiteContentToUpdate = await WebsiteContent.findById(
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
      res.status(200).json({
        message: "Cập nhật nội dung website thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === KÍCH HOẠT/VÔ HIỆU HÓA NỘI DUNG WEBSITE ===
  toggleWebsiteContentStatus: async (req, res) => {
    try {
      const websiteContentToToggle = await WebsiteContent.findById(
        req.params.id
      );
      if (!websiteContentToToggle) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      }

      // Lưu trạng thái mới
      websiteContentToToggle.status = !websiteContentToToggle.status;
      await websiteContentToToggle.save();
      const updatedWebsiteContent = await WebsiteContent.findById(
        req.params.id
      ).populate("content_type"); // populate theo virtual field

      res.status(200).json({
        message: `Nội dung website đã ${
          websiteContentToToggle.status ? "kích hoạt" : "vô hiệu hóa"
        } thành công`,
        data: updatedWebsiteContent,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA NỘI DUNG WEBSITE ===
  deleteWebsiteContent: async (req, res) => {
    try {
      const websiteContentToDelete = await WebsiteContent.findById(
        req.params.id
      );
      if (!websiteContentToDelete) {
        return res
          .status(404)
          .json({ message: "Nội dung website không tồn tại." });
      } else if (websiteContentToDelete.status) {
        return res
          .status(400)
          .json({ message: "Không thể xóa nội dung đã được đăng." });
      }

      await websiteContentToDelete.deleteOne();
      res.status(200).json({
        message: "Xóa nội dung website thành công",
        data: websiteContentToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = websiteContentCon;
