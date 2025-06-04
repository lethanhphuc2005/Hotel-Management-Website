const Image = require("../models/imageModel");

const imageCon = {
  // === KIỂM TRA ĐIỀU KIỆN HÌNH ẢNH ===
  validateImage: (imageData, imageId) => {
    const { url, room_class_id, target } = imageData;
    if (!url || !room_class_id || !target) {
      return {
        valid: false,
        message: "Thông tin hình ảnh không được để trống",
      };
    }

    if (typeof url !== "string" || typeof target !== "string") {
      return {
        valid: false,
        message: "Thông tin hình ảnh phải là chuỗi",
      };
    }

    if (target !== "main_room_class" && target !== "room_class") {
      return {
        valid: false,
        message: "Loại hình ảnh không hợp lệ",
      };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ HÌNH ẢNH (CÓ PHÂN TRANG, SẮP XẾP, LỌC) ===
  getAllImages: async (req, res) => {
    try {
      // Lấy các tham số truy vấn
      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        status,
        type,
      } = req.query;

      // Xây dựng bộ lọc
      const query = {};
      if (status) {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) {
          query.status = true;
        } else if (status === "false" || status === false) {
          query.status = false;
        }
      }
      if (type) {
        query.target = type;
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const images = await Image.find(query)
        .populate([{ path: "room_class" }])
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const total = await Image.countDocuments(query);

      if (!images || images.length === 0) {
        return res.status(404).json({ message: "Không có hình ảnh nào" });
      }
      res.status(200).json({
        message: "Lấy tất cả hình ảnh thành công",
        data: images,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ HÌNH ẢNH CHO USER ===
  getAllImagesForUser: async (req, res) => {
    try {
      // Lấy các tham số truy vấn
      const {
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        type,
      } = req.query;

      // Xây dựng bộ lọc
      const query = { status: true }; // Chỉ lấy hình ảnh có trạng thái true
      if (type) {
        query.target = type;
      }

      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const images = await Image.find(query)
        .populate([
          {
            path: "room_class",
            match: { status: true }, // Chỉ lấy loại phòng có trạng thái true
            select: "-status -createdAt -updatedAt", // Loại bỏ các trường không cần thiết
          },
        ]).
        select("-status -createdAt -updatedAt") // Loại bỏ các trường không cần thiết
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const total = await Image.countDocuments(query);

      if (!images || images.length === 0) {
        return res.status(404).json({ message: "Không có hình ảnh nào" });
      }
      res.status(200).json({
        message: "Lấy tất cả hình ảnh thành công",
        data: images,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY HÌNH ẢNH THEO ID ===
  getImageById: async (req, res) => {
    try {
      const imageData = await Image.findById(req.params.id)
        .populate([{ path: "room_class" }])
        .exec();
      if (!imageData) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }
      res.status(200).json({
        message: "Lấy hình ảnh thành công",
        data: imageData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM HÌNH ẢNH ===
  addImage: async (req, res) => {
    try {
      const newImage = new Image(req.body);
      const validation = imageCon.validateImage(newImage);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const savedImage = await newImage.save();
      if (!savedImage) {
        return res.status(500).json({ message: "Lỗi khi lưu hình ảnh" });
      }

      await savedImage.populate({ path: "room_class" });

      // Trả về hình ảnh đã lưu
      res.status(201).json({
        message: "Thêm hình ảnh thành công",
        data: savedImage,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT HÌNH ẢNH ===
  updateImage: async (req, res) => {
    try {
      const imageToUpdate = await Image.findById(req.params.id);
      if (!imageToUpdate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }
      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? imageToUpdate.toObject()
          : { ...imageToUpdate.toObject(), ...req.body };

      const validation = imageCon.validateImage(updatedData, req.params.id);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      await imageToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật hình ảnh thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA HÌNH ẢNH ===
  deleteImage: async (req, res) => {
    try {
      const imageToDelete = await Image.findById(req.params.id);
      if (!imageToDelete) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy hình ảnh loại phòng" });
      }

      // Kiểm tra xem hình ảnh có đang được sử dụng hay không
      if (imageToDelete.status === true) {
        return res
          .status(400)
          .json({ message: "Không thể xóa hình ảnh đang được sử dụng" });
      }

      await imageToDelete.deleteOne();
      res.status(200).json({
        message: "Xóa hình ảnh thành công",
        data: imageToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = imageCon;
