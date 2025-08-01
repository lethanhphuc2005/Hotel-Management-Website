const MainRoomClass = require("../models/mainRoomClass.model");
const Image = require("../models/image.model");
const RoomClass = require("../models/roomClass.model");
const {
  deleteImagesOnError,
  deleteOldImages,
} = require("../middlewares/cloudinaryUpload.middleware");

const mainRoomClassController = {
  validateMainRoomClass: async (MainRoomClassData, MainRoomClassId) => {
    const { name, description, status, image } = MainRoomClassData;
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
    const existing = await MainRoomClass.findOne({ name }).lean();
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
        .populate("room_class_list image")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

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
        .populate("room_class_list image")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit));

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
      ).populate("room_class_list image");
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
  addMainRoomClass: async (req, res) => {
    try {
      const newMainRoomClass = new MainRoomClass(req.body);

      // Validate dữ liệu loại phòng chính
      const validation = await mainRoomClassController.validateMainRoomClass(
        newMainRoomClass
      );
      if (!validation.valid) {
        // Nếu có hình ảnh, xóa ảnh đã upload để tránh lưu trữ không cần thiết
        if (req.file) {
          deleteImagesOnError([req.file]);
        }
        return res.status(400).json({ message: validation.message });
      }

      // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng chính
      if (req.file) {
        const image = new Image({
          url: req.file.path, // ví dụ: 'main_room_class/abc.jpg'
          public_id: req.file.filename, // public_id từ Cloudinary
          target: "main_room_class",
          target_id: newMainRoomClass._id,
        });
        await image.save();
      }

      const savedMainRoomClass = await newMainRoomClass.save();
      return res.status(200).json({
        message: "Thêm loại phòng chính thành công",
        data: savedMainRoomClass,
      });
    } catch (error) {
      if (req.file) {
        deleteImagesOnError([req.file]);
      }
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // === CẬP NHẬT LOẠI PHÒNG CHÍNH ===
  updateMainRoomClass: async (req, res) => {
    try {
      const mainRoomClassToUpdate = await MainRoomClass.findById(req.params.id);
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
      const validation = await mainRoomClassController.validateMainRoomClass(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        if (req.file) {
          deleteImagesOnError([req.file]); // Xóa ảnh đã upload nếu có lỗi
        }
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật MainRoomClass
      await mainRoomClassToUpdate.updateOne({ $set: updatedData });

      if (req.file) {
        const oldImage = await Image.findOne({
          target: "main_room_class",
          target_id: mainRoomClassToUpdate._id,
        });
        if (oldImage) {
          // Xóa hình ảnh cũ nếu có
          deleteOldImages(oldImage.public_id);
          // Cập nhật hình ảnh mới
          oldImage.url = req.file.path;
          oldImage.public_id = req.file.filename;
          await oldImage.save();
        } else {
          // Nếu không có hình ảnh cũ, tạo mới
          const newImage = new Image({
            url: req.file.path,
            public_id: req.file.filename,
            target: "main_room_class",
            target_id: mainRoomClassToUpdate._id,
          });
          await newImage.save();
        }
      }

      // Lấy lại dữ liệu loại phòng chính đã cập nhật
      const updatedMainRoomClass = await MainRoomClass.findById(
        req.params.id
      ).populate("image");
      res.status(200).json({
        message: "Cập nhật loại phòng chính thành công",
        data: updatedMainRoomClass,
      });
    } catch (error) {
      if (req.file) {
        deleteImagesOnError([req.file]); // Xóa ảnh đã upload nếu có lỗi
      }
      res.status(500).json(error);
    }
  },

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

module.exports = mainRoomClassController;
