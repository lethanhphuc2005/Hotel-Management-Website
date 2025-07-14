const { Feature, Room_Class_Feature } = require("../models/feature.model");
const {
  upload,
  deleteOldImages,
  deleteImagesOnError,
} = require("../middlewares/upload");

const featureController = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN TIỆN NGHI ===
  validateFeature: async (featureData, featureId) => {
    const { name, description } = featureData;

    // Check required fields
    if (!name || !description) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin tiện nghi.",
      };
    }

    // Check string length
    if (name.length > 100 || description.length > 500) {
      return { valid: false, message: "Tên hoặc mô tả tiện nghi quá dài." };
    }

    // Check for duplicate name
    const existing = await Feature.findOne({ name });
    if (
      existing &&
      (!featureId || existing._id.toString() !== featureId.toString())
    ) {
      return { valid: false, message: "Tên tiện nghi đã tồn tại." };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ TIỆN NGHI (CÓ TÌM KIẾM, PHÂN TRANG, SẮP XẾP, SẮP XẾP THEO TRẠNG THÁI) ===
  getAllFeatures: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit,
        sort = "createdAt",
        order = "asc",
        status, // Thêm tham số lọc theo trạng thái
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số tiện nghi (phục vụ phân trang)
      const total = await Feature.countDocuments(query);

      // Lấy dữ liệu tiện nghi
      const features = await Feature.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate({
          path: "room_class_used_list",
          populate: {
            path: "room_class_id", // Trong bảng trung gian -> roomType_Feature
            model: "room_class",
          },
        })
        .exec();

      if (!features || features.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: features,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY TẤT CẢ TIỆN NGHI CHO USER ===
  getAllFeaturesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit,
        sort = "price",
        order = "asc",
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
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số tiện nghi (phục vụ phân trang)
      const total = await Feature.countDocuments(query);

      // Lấy dữ liệu tiện nghi
      const features = await Feature.find(query)
        .sort(sortOption)
        .skip(skip)
        .select("-status -createdAt -updatedAt")
        .limit(parseInt(limit))
        .populate({
          path: "room_class_used_list",
          populate: {
            path: "room_class_id", //
            model: "room_class",
            match: { status: true }, // Chỉ lấy loại phòng đang hoạt động
            select: "-status -createdAt -updatedAt", // Loại bỏ các trường không cần thiết
          },
        })
        .exec();

      if (!features || features.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: features,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY TIỆN NGHI THEO ID ===
  getFeatureById: async (req, res) => {
    try {
      const { id } = req.params;
      const feature = await Feature.findById(id).populate({
        path: "room_class_used_list", // Virtual field từ Feature -> RoomType_Feature
        populate: {
          path: "room_class_id", // Trong bảng trung gian -> roomType
          model: "room_class",
        },
      });
      if (!feature) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }
      res.status(200).json({
        message: "Lấy tiện nghi thành công",
        data: feature,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === THÊM TIỆN NGHI MỚI ===
  addFeature: [
    upload.single("image"), // Sử dụng middleware upload để xử lý file ảnh
    async (req, res) => {
      try {
        const newFeature = new Feature(req.body);

        // Validate feature data
        const validation = await featureController.validateFeature(newFeature);
        if (!validation.valid) {
          // Xoá ảnh đã upload nếu có lỗi
          if (req.file) {
            deleteImagesOnError(req.file.filename);
          }
          return res.status(400).json({ message: validation.message });
        }

        newFeature.image = req.file.filename; // Lưu đường dẫn hình ảnh

        await newFeature.save();
        res.status(201).json({
          message: "Thêm tiện nghi thành công",
          data: newFeature,
        });
      } catch (error) {
        // Xoá ảnh đã upload nếu có lỗi
        if (req.file) {
          deleteImagesOnError(req.file.filename);
        }
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // === CẬP NHẬT TIỆN NGHI ===
  updateFeature: [
    upload.single("image"), // Sử dụng middleware upload để xử lý file ảnh
    async (req, res) => {
      try {
        const featureToUpdate = await Feature.findById(req.params.id);
        if (!featureToUpdate) {
          return res.status(404).json({ message: "Tiện nghi không tồn tại." });
        }

        // Nếu không có dữ liệu nào trong req.body, giữ nguyên tiện nghi hiện tại
        const updatedData =
          Object.keys(req.body).length === 0
            ? featureToUpdate.toObject()
            : { ...featureToUpdate.toObject(), ...req.body };

        // Kiểm tra dữ liệu trong req.body
        const validation = await featureController.validateFeature(
          updatedData,
          req.params.id
        );
        if (!validation.valid) {
          // Xoá ảnh đã upload nếu có lỗi
          if (req.file) {
            deleteImagesOnError(req.file.filename);
          }
          return res.status(400).json({ message: validation.message });
        }

        if (req.file) {
          // Xoá ảnh cũ nếu có
          if (featureToUpdate.image) {
            deleteOldImages(featureToUpdate.image);
          }
          updatedData.image = req.file.filename; // Cập nhật đường dẫn hình ảnh mới
        } else {
          updatedData.image = featureToUpdate.image; // Giữ nguyên đường dẫn hình ảnh cũ nếu không có file mới
        }

        const updatedFeature = await featureToUpdate.updateOne({
          $set: updatedData,
        });

        res.status(200).json({
          message: "Cập nhật tiện nghi thành công",
          data: updatedFeature,
        });
      } catch (error) {
        // Xoá ảnh đã upload nếu có lỗi
        if (req.file) {
          deleteImagesOnError(req.file.filename);
        }
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // === KÍCH HOẠT/VÔ HIỆU HÓA TIỆN NGHI ===
  toggleFeatureStatus: async (req, res) => {
    try {
      const featureToToggle = await Feature.findById(req.params.id);
      if (!featureToToggle) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }

      // Kiểm tra xem tiện nghi có đang được sử dụng trong loại phòng nào không
      const isUsedInRoomType = await Room_Class_Feature.exists({
        feature_id: req.params.id,
      });
      if (isUsedInRoomType && featureToToggle.status === true) {
        return res
          .status(400)
          .json({ message: "Tiện nghi đang được sử dụng trong loại phòng." });
      }

      // Cập nhật trạng thái tiện nghi
      featureToToggle.status = !featureToToggle.status;
      const updatedFeature = await featureToToggle.save();

      res.status(200).json({
        message: `Tiện nghi đã ${
          featureToToggle.status ? "kích hoạt" : "vô hiệu hoá"
        } thành công`,
        data: updatedFeature,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA TIỆN NGHI ===
  deleteFeature: async (req, res) => {
    try {
      const featureToDelete = await Feature.findById(req.params.id);
      if (!featureToDelete) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }

      // Kiểm tra xem tiện nghi có đang được sử dụng trong loại phòng nào không
      const isUsedInRoomType = await Room_Class_Feature.exists({
        feature_id: req.params.id,
      });
      if (isUsedInRoomType) {
        return res
          .status(400)
          .json({ message: "Tiện nghi đang được sử dụng trong loại phòng." });
      } else if (featureToDelete.status) {
        return res
          .status(400)
          .json({ message: "Không thể xoá tiện nghi đang hoạt động." });
      }

      // Xoá tiện nghi
      await Feature.findByIdAndDelete(req.params.id);

      // Xoá tiện nghi khỏi bảng trung gian nếu có
      await Room_Class_Feature.deleteMany({ MaTN: req.params.id });

      res.status(200).json({
        message: "Xoá tiện nghi thành công",
        data: featureToDelete,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = featureController;
