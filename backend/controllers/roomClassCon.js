const RoomClass = require("../models/roomClassModel");
const MainRoomClass = require("../models/mainRoomClassModel");
const Image = require("../models/imageModel");
const { Room_Class_Feature } = require("../models/featureModel");

const roomClassCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN LOẠI PHÒNG ===
  validateRoomClass: async (roomClassData, roomClassId) => {
    const {
      main_room_class_id,
      name,
      bed_amount,
      capacity,
      view,
      description,
      status,
      images = [],
      features = [],
    } = roomClassData;

    // Check required fields
    if (
      !name ||
      !description ||
      !view ||
      !main_room_class_id ||
      !bed_amount ||
      !capacity
    ) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại phòng.",
      };
    }

    // Kiểm tra MaLP có tồn tại trong loại phòng chính không
    const mainRoomClassExists = await MainRoomClass.findById(
      main_room_class_id
    ).exec();
    if (!mainRoomClassExists) {
      return { valid: false, message: "Mã loại phòng chính không hợp lệ." };
    }

    // Check string length
    if (name.length > 100 || description.length > 500) {
      return {
        valid: false,
        message: "Độ dài tên loại phòng hoặc mô tả không hợp lệ.",
      };
    }

    // Check for duplicate room type name
    const existing = await RoomClass.findOne({ name });
    if (
      existing &&
      (!roomClassId || existing._id.toString() !== roomClassId.toString())
    ) {
      return { valid: false, message: "Tên loại phòng đã tồn tại." };
    }

    // Check status
    if (typeof status !== "boolean") {
      return { valid: false, message: "Trạng thái phải là true hoặc false." };
    }
    // Check if the room type is active
    // if (roomClassId) {
    //   const existingRoomClass = await RoomClass.findById(roomClassId);
    //   if (existingRoomClass && existingRoomClass.TrangThai === true) {
    //     return {
    //       valid: false,
    //       message: "Không thể cập nhật loại phòng đang hoạt động.",
    //     };
    //   }
    // }

    // Check features if provided
    if (Array.isArray(features) && features.length > 0) {
      for (const feature of features) {
        if (!feature.feature_id || typeof feature.feature_id !== "string") {
          return { valid: false, message: "Tiện nghi không hợp lệ." };
        }
        if (feature.feature_id.length !== 24) {
          return { valid: false, message: "Mã tiện nghi không hợp lệ." };
        }
      }
    }

    // Check images if provided
    if (Array.isArray(images) && images.length > 0) {
      for (const imagePath of images) {
        if (typeof imagePath !== "string" || imagePath.trim() === "") {
          return { valid: false, message: "Hình ảnh không hợp lệ." };
        }
      }
    }

    // Kiểm tra view
    const validViews = ["sea", "mountain", "city", "garden", "pool"];
    if (!validViews.includes(view)) {
      return {
        valid: false,
        message:
          "View không hợp lệ. Các giá trị hợp lệ: sea, mountain, city, garden, pool.",
      };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ LOẠI PHÒNG ===
  getAllRoomClasses: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        type,
        minBed = 1,
        maxBed = 10,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        feature,
        status,
        sort = "createdAt", // default sort by createdAt
        order = "desc", // default order desc
      } = req.query;

      // Điều kiện tìm kiếm
      const query = {};
      if (search && search.trim() !== "") {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { view: { $regex: search, $options: "i" } },
        ];
      }
      if (type) {
        query.main_room_class_id = type;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice, 10);
        if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
      }

      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed, 10);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed, 10);
      }

      if (minCapacity || maxCapacity) {
        query.capacity = {};
        if (minCapacity) query.capacity.$gte = parseInt(minCapacity, 10);
        if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity, 10);
      }

      if (status !== undefined) {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }

      // Đếm tổng số bản ghi phù hợp
      const total = await RoomClass.countDocuments(query);
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Lấy dữ liệu loại phòng
      let roomClasses = await RoomClass.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate([
          { path: "main_room_class" },
          {
            path: "features",
            populate: {
              path: "feature_id",
              model: "feature",
            },
          },
          { path: "images" },
        ])
        .exec();

      // Lọc theo tiện nghi nếu có
      let filteredRoomClasses = roomClasses;
      let filteredTotal = total;
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        filteredRoomClasses = roomClasses.filter((room) => {
          const roomFeatureIds = room.features
            .map((f) => f.feature_id && f.feature_id._id.toString())
            .filter(Boolean);
          return featureList.every((id) => roomFeatureIds.includes(id));
        });
        filteredTotal = filteredRoomClasses.length;
      }

      if (!filteredRoomClasses || filteredRoomClasses.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: filteredRoomClasses,
        pagination: {
          total: filteredTotal,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredTotal / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
  getAllRoomClassesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        type,
        minBed = 1,
        maxBed = 10,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        feature,
        sort = "createdAt", // default sort by createdAt
        order = "desc", // default order desc
      } = req.query;

      // Điều kiện tìm kiếm
      const query = { status: true }; // Chỉ lấy loại phòng đang hoạt động
      if (search && search.trim() !== "") {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { view: { $regex: search, $options: "i" } },
        ];
      }
      if (type) {
        query.main_room_class_id = type;
      }
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice, 10);
        if (maxPrice) query.price.$lte = parseInt(maxPrice, 10);
      }

      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed, 10);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed, 10);
      }

      if (minCapacity || maxCapacity) {
        query.capacity = {};
        if (minCapacity) query.capacity.$gte = parseInt(minCapacity, 10);
        if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity, 10);
      }

      // Đếm tổng số bản ghi phù hợp
      const total = await RoomClass.countDocuments(query);

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Xác định sort object
      const sortOrder = order === "asc" ? 1 : -1;
      const sortObj = {};
      sortObj[sort] = sortOrder;

      // Lấy dữ liệu loại phòng
      let roomClasses = await RoomClass.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate([
          {
            path: "main_room_class",
            select: "-status -createdAt -updatedAt", // Không cần thông tin trạng thái, createdAt, updatedAt
            match: { status: true },
          }, // Chỉ lấy loại phòng chính đang hoạt động
          {
            path: "features",
            populate: {
              path: "feature_id",
              model: "feature",
              select: "-status -createdAt -updatedAt", // Không cần thông tin trạng thái, createdAt, updatedAt
              match: { status: true }, // Chỉ lấy tiện nghi đang hoạt động
            },
          },
          { path: "images", select: "url", match: { status: true } }, // Chỉ lấy hình ảnh đang hoạt động
        ])
        .exec();

      let filteredRoomClasses = roomClasses;
      let filteredTotal = total;
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        filteredRoomClasses = roomClasses.filter((room) => {
          const roomFeatureIds = room.features
            .map((f) => f.feature_id && f.feature_id._id.toString())
            .filter(Boolean);
          return featureList.every((id) => roomFeatureIds.includes(id));
        });
        filteredTotal = filteredRoomClasses.length;
      }

      if (!filteredRoomClasses || filteredRoomClasses.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: filteredRoomClasses,
        pagination: {
          total: filteredTotal,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(filteredTotal / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY LOẠI PHÒNG THEO ID ===
  getRoomClassById: async (req, res) => {
    try {
      const roomClassData = await RoomClass.find({
        _id: req.params.id,
      }).populate([
        {
          path: "main_room_class",
          select: "-status -createdAt -updatedAt",
          match: { status: true },
        }, // Chỉ lấy loại phòng chính đang hoạt động
        {
          path: "features",
          populate: {
            path: "feature_id",
            model: "feature",
            select: "-status -createdAt -updatedAt", // Không cần thông tin trạng thái, createdAt, updatedAt
            match: { status: true }, // Chỉ lấy tiện nghi đang hoạt động
          },
        },
        { path: "images", select: "url", match: { status: true } },
      ]);
      if (!roomClassData || roomClassData.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }
      res.status(200).json({
        message: "Lấy loại phòng thành công",
        data: roomClassData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === THÊM LOẠI PHÒNG MỚI ===
  addRoomClass: async (req, res) => {
    try {
      const { images = [], features = [] } = req.body;
      const newRoomClass = new RoomClass(req.body);
      const validation = await roomClassCon.validateRoomClass(newRoomClass);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng
      if (Array.isArray(images) && images.length > 0) {
        const imageDocs = [];
        for (const imagePath of images) {
          try {
            const newImage = new Image({
              room_class_id: newRoomClass._id,
              url: imagePath,
              target: "room_class",
            });
            const savedImage = await newImage.save();
            imageDocs.push(savedImage._id);
          } catch (error) {
            newRoomClass.images = imageDocs.filter((id) => id);
          }
        }
        newRoomClass.images = imageDocs;
      }

      // Nếu có tiện nghi: lưu vào bảng tiện nghi & gán vào features của loại phòng chính
      if (Array.isArray(features) && features.length > 0) {
        const featureDocs = [];
        for (const feature of features) {
          try {
            const newFeature = new Room_Class_Feature({
              room_class_id: newRoomClass._id,
              feature_id: feature.feature_id,
            });
            const savedFeature = await newFeature.save();
            featureDocs.push(savedFeature._id);
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
        }
        newRoomClass.features = featureDocs;
      }

      await newRoomClass.save();
      res.status(201).json({
        message: "Thêm loại phòng thành công",
        data: newRoomClass,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === CẬP NHẬT LOẠI PHÒNG ===
  updateRoomClass: async (req, res) => {
    try {
      const { images = [], features = [] } = req.body;
      const roomClassToUpdate = await RoomClass.findById(req.params.id);
      if (!roomClassToUpdate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? roomClassToUpdate.toObject()
          : { ...roomClassToUpdate.toObject(), ...req.body };

      const validation = await roomClassCon.validateRoomClass(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật hình ảnh
      if (images && Array.isArray(images) && images.length > 0) {
        try {
          // Xóa các hình ảnh cũ liên kết với roomClassMain
          await Image.deleteMany({
            room_class_id: req.params.id,
          });

          // Thêm các hình ảnh mới
          const imageData = images.map((image) => ({
            room_class_id: req.params.id,
            url: image,
            target: "room_class",
          }));

          await Image.insertMany(imageData);
        } catch (imageError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật hình ảnh",
            error: imageError.message,
          });
        }
      }

      // Cập nhật tiện nghi
      if (features && Array.isArray(features) && features.length > 0) {
        try {
          // Xóa các tiện nghi cũ liên kết với roomClass
          await Room_Class_Feature.deleteMany({
            room_class_id: req.params.id,
          });

          // Thêm các tiện nghi mới
          const featuresData = features.map((feature) => ({
            room_class_id: req.params.id,
            feature_id: feature.feature_id,
          }));

          await Room_Class_Feature.insertMany(featuresData);
        } catch (featureError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật tiện nghi",
            error: featureError.message,
          });
        }
      }

      // Cập nhật các trường khác
      await roomClassToUpdate.updateOne({ $set: req.body });
      // Lấy lại dữ liệu đã cập nhật
      const updatedRoomClass = await RoomClass.findById(req.params.id).populate(
        [
          { path: "main_room_class" },
          {
            path: "features",
            populate: { path: "feature_id", model: "feature" },
          },
          { path: "images" },
        ]
      );

      res.status(200).json({
        message: "Cập nhật loại phòng thành công",
        data: updatedRoomClass,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA LOẠI PHÒNG ===
  deleteRoomClass: async (req, res) => {
    try {
      const deletedRoomClass = await RoomClass.findById(req.params.id);
      if (!deletedRoomClass) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng phù hợp" });
      }
      // Kiểm tra nếu loại phòng đang ở trạng thái hoạt động thì không cho phép xóa
      if (deletedRoomClass.status === true) {
        return res.status(400).json({
          message: "Không thể xóa loại phòng đang hoạt động.",
        });
      }
      // Xóa loại phòng
      await RoomClass.findByIdAndDelete(req.params.id);

      // Xóa các hình ảnh liên quan
      try {
        await Image.deleteMany({ room_class_id: req.params.id });
      } catch (imgError) {
        return res.status(500).json({
          message: "Lỗi khi xóa hình ảnh liên quan",
          error: imgError.message,
        });
      }
      // Xóa các tiện nghi liên quan
      try {
        await Room_Class_Feature.deleteMany({ room_class_id: req.params.id });
      } catch (featureError) {
        return res.status(500).json({
          message: "Lỗi khi xóa tiện nghi liên quan",
          error: featureError.message,
        });
      }

      res.status(200).json({
        message: "Xóa loại phòng thành công",
        data: deletedRoomClass,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = roomClassCon;
