const MainRoomClass = require("../models/mainRoomClassModel");
const Image = require("../models/imageModel");
const { Room_Class_Feature } = require("../models/featureModel");
const RoomClass = require("../models/roomClassModel");
const {
  upload,
  deleteImagesOnError,
  deleteOldImages,
} = require("../middlewares/upload");

const mainRoomClassCon = {
  validateMainRoomClass: async (MainRoomClassData, MainRoomClassId) => {
    const { name, description, status, images } = MainRoomClassData;
    // Kiểm tra các trường bắt buộc
    if (!name || !description) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại phòng chính.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (name.length > 100 || description.length > 500) {
      return {
        valid: false,
        message: "Độ dài tên loại phòng hoặc mô tả không hợp lệ.",
      };
    }
    // Kiểm tra trùng tên loại phòng
    const existing = await MainRoomClass.findOne({ name });
    if (
      existing &&
      (!MainRoomClassId ||
        existing._id.toString() !== MainRoomClassId.toString())
    ) {
      return { valid: false, message: "Tên loại phòng đã tồn tại." };
    }
    // Kiểm tra trạng thái
    if (typeof status !== "boolean") {
      return { valid: false, message: "Trạng thái phải là true hoặc false." };
    }

    // Kiểm tra xem có loại phòng nào liên kết không
    const roomClasses = await RoomClass.find({
      main_room_class_id: MainRoomClassData._id,
    });
    if (roomClasses.length > 0) {
      return {
        valid: false,
        message:
          "Không thể cập nhật loại phòng chính vì có loại phòng liên kết.",
      };
    }

    // Kiểm tra hình ảnh nếu có
    if (Array.isArray(images) && images.length > 0) {
      for (const imagePath of images) {
        if (typeof imagePath !== "string" || imagePath.trim() === "") {
          return { valid: false, message: "Hình ảnh không hợp lệ." };
        }
      }
    }

    return { valid: true };
  },
  // === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH ===
  getAllMainRoomClasses: async (req, res) => {
    try {
      const {
        search = "",
        sort = "createdAt",
        order = "asc",
        page = 1,
        limit = 10,
        status,
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = {};
      if (search && search.trim() !== "") {
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

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Đếm tổng số bản ghi
      const total = await MainRoomClass.countDocuments(query);
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy dữ liệu với phân trang
      const mainRoomClasses = await MainRoomClass.find(query)
        .populate([{ path: "room_class_list" }, { path: "images" }])
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      if (!mainRoomClasses || mainRoomClasses.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại phòng chính nào" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: mainRoomClasses,
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

  // === LẤY TẤT CẢ LOẠI PHÒNG CHÍNH CHO USER ===
  getAllMainRoomClassesForUser: async (req, res) => {
    try {
      const {
        search = "",
        sort = "createdAt",
        order = "asc",
        page = 1,
        limit = 10,
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = { status: true }; // Chỉ lấy loại phòng chính đang hoạt động
      if (search && search.trim() !== "") {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Đếm tổng số bản ghi
      const total = await MainRoomClass.countDocuments(query);
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy dữ liệu với phân trang
      const mainRoomClasses = await MainRoomClass.find(query)
        .populate([
          {
            path: "room_class_list",
            match: { status: true },
            select: "-status -createdAt -updatedAt",
          }, // Chỉ lấy loại phòng đang hoạt động
          {
            path: "images",
            select: "-status -createdAt -updatedAt",
            match: { status: true },
          }, // Chỉ lấy hình ảnh đang hoạt động
        ])
        .select("-status -createdAt -updatedAt")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      if (!mainRoomClasses || mainRoomClasses.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại phòng chính nào" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: mainRoomClasses,
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

  // === LẤY LOẠI PHÒNG CHÍNH THEO ID ===
  getMainRoomClassById: async (req, res) => {
    try {
      const mainRoomClass = await MainRoomClass.findById(
        req.params.id
      ).populate([
        { path: "room_class_list" },
        { path: "images", select: "url", match: { status: true } },
      ]);
      if (!mainRoomClass) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }
      res.status(200).json({
        message: "Lấy loại phòng chính thành công",
        data: mainRoomClass,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM LOẠI PHÒNG CHÍNH ===
  addMainRoomClass: [
    upload.array("image", 5),
    async (req, res) => {
      try {
        const newMainRoomClass = new MainRoomClass(req.body);

        // Validate dữ liệu loại phòng chính
        const validation = await mainRoomClassCon.validateMainRoomClass(
          newMainRoomClass
        );
        if (!validation.valid) {
          // Nếu có hình ảnh, xóa ảnh đã upload để tránh lưu trữ không cần thiết
          if (req.files && req.files.length > 0) {
            deleteImagesOnError(req.files);
          }
          return res.status(400).json({ message: validation.message });
        }

        // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng chính
        if (Array.isArray(req.files) && req.files.length > 0) {
          const imageDocs = [];

          for (const file of req.files) {
            try {
              const newImage = new Image({
                room_class_id: newMainRoomClass._id,
                url: `/images/${file.filename}`, // hoặc `/images/${file.filename}` nếu dùng Multer cấu hình thư mục public
                target: "main_room_class",
              });

              const savedImage = await newImage.save();
              imageDocs.push(savedImage._id);
            } catch (error) {
              console.error("Lỗi khi lưu ảnh:", error);
              // Có thể log hoặc push ảnh lỗi ra một mảng khác để xử lý nếu cần
            }
          }
          newMainRoomClass.images = imageDocs;
        }

        const savedMainRoomClass = await newMainRoomClass.save();
        return res.status(200).json({
          message: "Thêm loại phòng chính thành công",
          data: savedMainRoomClass,
        });
      } catch (error) {
        if (req.files && req.files.length > 0) {
          deleteImagesOnError(req.files);
        }
        return res.status(500).json({ message: "Lỗi server", error });
      }
    },
  ],

  // === CẬP NHẬT LOẠI PHÒNG CHÍNH ===
  updateMainRoomClass: [
    upload.array("image", 5),
    async (req, res) => {
      try {
        const mainRoomClassToUpdate = await MainRoomClass.findById(
          req.params.id
        );
        if (!mainRoomClassToUpdate) {
          return res
            .status(404)
            .json({ message: "Loại phòng chính không tồn tại" });
        }

        const updatedData =
          Object.keys(req.body).length === 0
            ? mainRoomClassToUpdate.toObject()
            : { ...mainRoomClassToUpdate.toObject(), ...req.body };

        // Validate updated data
        const validation = await mainRoomClassCon.validateMainRoomClass(
          updatedData,
          req.params.id
        );
        if (!validation.valid) {
          if (req.files && req.files.length > 0) {
            deleteImagesOnError(req.files);
          }
          return res.status(400).json({ message: validation.message });
        }

        // Cập nhật MainRoomClass
        await mainRoomClassToUpdate.updateOne({ $set: updatedData });

        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
          try {
            // Lấy danh sách ảnh cũ để xóa file vật lý
            const oldImages = await Image.find({
              room_class_id: req.params.id,
            });
            const oldImagePaths = oldImages.map((img) => img.url); // ví dụ: "/images/abc.jpg"
            deleteOldImages(oldImagePaths); // dùng hàm hỗ trợ bạn đã viết

            // Xóa ảnh cũ khỏi DB
            await Image.deleteMany({ room_class_id: req.params.id });

            // Thêm ảnh mới vào DB
            const imageData = req.files.map((file) => ({
              room_class_id: req.params.id,
              url: `/images/${file.filename}`,
              target: "main_room_class",
            }));

            await Image.insertMany(imageData);
          } catch (imageError) {
            return res.status(400).json({
              message: "Lỗi khi cập nhật hình ảnh",
              error: imageError.message,
            });
          }
        }

        // Lấy lại dữ liệu loại phòng chính đã cập nhật
        const updatedMainRoomClass = await MainRoomClass.findById(
          req.params.id
        ).populate([{ path: "images", select: "url" }]);
        res.status(200).json({
          message: "Cập nhật loại phòng chính thành công",
          data: updatedMainRoomClass,
        });
      } catch (error) {
        if (req.files && req.files.length > 0) {
          deleteImagesOnError(req.files);
        }
        res.status(500).json(error);
      }
    },
  ],

  // === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG CHÍNH ===
  toggleMainRoomClassStatus: async (req, res) => {
    try {
      const mainRoomClassToToggle = await MainRoomClass.findById(
        req.params.id
      ).populate("room_class_list");
      if (!mainRoomClassToToggle) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }

      // Kiểm tra xem loại phòng có đang được sử dụng không
      const isUsed = await RoomClass.findOne({
        main_room_class_id: req.params.id,
      });
      if (isUsed) {
        return res.status(400).json({
          message:
            "Không thể thay đổi trạng thái loại phòng chính này vì nó đang được sử dụng.",
        });
      }

      // Chỉ cho phép vô hiệu hóa nếu loại phòng không có loại phòng con nào
      if (mainRoomClassToToggle.room_class_list.length > 0) {
        return res.status(400).json({
          message: "Không thể vô hiệu hóa loại phòng chính có loại phòng con.",
        });
      }

      mainRoomClassToToggle.status = !mainRoomClassToToggle.status;
      await mainRoomClassToToggle.save();

      res.status(200).json({
        message: `Loại phòng chính đã ${
          mainRoomClassToToggle.status ? "kích hoạt" : "vô hiệu hóa"
        } thành công`,
        data: mainRoomClassToToggle,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XOÁ LOẠI PHÒNG CHÍNH ===
  deleteMainRoomClass: async (req, res) => {
    try {
      const mainRoomClass = await MainRoomClass.findById(req.params.id);
      if (!mainRoomClass) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }
      // Kiểm tra xem loại phòng có đang được sử dụng không
      const isUsed = await RoomClass.findOne({
        main_room_class_id: req.params.id,
      });
      if (isUsed) {
        return res.status(400).json({
          message: "Không thể xóa loại phòng này vì nó đang được sử dụng.",
        });
      }

      if (mainRoomClass.status) {
        return res.status(400).json({
          message: "Không thể xóa loại phòng chính đang hoạt động.",
        });
      }

      // Xóa các hình ảnh liên quan
      try {
        await Image.deleteMany({ room_class_id: req.params.id });
      } catch (imageError) {
        return res.status(400).json({
          message: "Lỗi khi xóa hình ảnh liên quan",
          error: imageError.message,
        });
      }

      await mainRoomClass.deleteOne();
      res.status(200).json({
        message: "Xóa loại phòng chính thành công",
        data: mainRoomClass,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = mainRoomClassCon;
