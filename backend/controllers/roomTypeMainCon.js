const RoomTypeMainModel = require("../models/roomTypeMainModel");
const ImageModel = require("../models/imageModel");
const { RoomType_AmenityModel } = require("../models/amenityModel");
const RoomTypeModel = require("../models/roomTypeModel");

const roomTypeMainCon = {
  validateRoomTypeMain: async (RoomTypeMainData, RoomTypeMainId) => {
    const { TenLP, MoTa, TrangThai, HinhAnh } = RoomTypeMainData;
    // Kiểm tra các trường bắt buộc
    if (!TenLP || !MoTa) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại phòng chính.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (TenLP.length > 100 || MoTa.length > 500) {
      return {
        valid: false,
        message: "Độ dài tên loại phòng hoặc mô tả không hợp lệ.",
      };
    }
    // Kiểm tra trùng tên loại phòng
    const existing = await RoomTypeMainModel.findOne({ TenLP });
    if (
      existing &&
      (!RoomTypeMainId || existing._id.toString() !== RoomTypeMainId.toString())
    ) {
      return { valid: false, message: "Tên loại phòng đã tồn tại." };
    }
    // Kiểm tra trạng thái
    if (typeof TrangThai !== "boolean") {
      return { valid: false, message: "Trạng thái phải là true hoặc false." };
    }

    // Kiểm tra xem có loại phòng nào liên kết không
    const roomTypes = await RoomType_AmenityModel.find({
      MaLP: RoomTypeMainData._id,
    });
    if (roomTypes.length > 0) {
      return {
        valid: false,
        message:
          "Không thể cập nhật loại phòng chính vì có loại phòng liên kết.",
      };
    }

    // Kiểm tra hình ảnh nếu có
    if (Array.isArray(HinhAnh) && HinhAnh.length > 0) {
      for (const imagePath of HinhAnh) {
        if (typeof imagePath !== "string" || imagePath.trim() === "") {
          return { valid: false, message: "Hình ảnh không hợp lệ." };
        }
      }
    }

    return { valid: true };
  },
  // === Lấy tất cả loại phòng với tìm kiếm, sắp xếp, phân trang ===
  getAllRoomTypeMains: async (req, res) => {
    try {
      const {
        search = "",
        sort = "_id",
        order = "asc",
        page = 1,
        limit = 10,
        status,
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = {};
      if (search && search.trim() !== "") {
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
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Đếm tổng số bản ghi
      const total = await RoomTypeMainModel.countDocuments(query);

      // Lấy dữ liệu với phân trang
      const roomTypeMains = await RoomTypeMainModel.find(query)
        .populate([
          { path: "DanhSachLoaiPhong" },
          { path: "HinhAnh", select: "HinhAnh" },
        ])
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      if (!roomTypeMains || roomTypeMains.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại phòng chính nào" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: roomTypeMains,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === Lấy loại phòng cho user ===
  getAllRoomTypeMainsForUser: async (req, res) => {
    try {
      const {
        search = "",
        sort = "_id",
        order = "asc",
        page = 1,
        limit = 10,
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = { TrangThai: true }; // Chỉ lấy loại phòng chính đang hoạt động
      if (search && search.trim() !== "") {
        query.$or = [
          { TenND: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Đếm tổng số bản ghi
      const total = await RoomTypeMainModel.countDocuments(query);

      // Lấy dữ liệu với phân trang
      const roomTypeMains = await RoomTypeMainModel.find(query)
        .populate([
          {
            path: "DanhSachLoaiPhong",
            match: { TrangThai: true },
            select: "-TrangThai",
          }, // Chỉ lấy loại phòng đang hoạt động
          {
            path: "HinhAnh",
            select: "HinhAnh",
            match: { TrangThai: true },
          }, // Chỉ lấy hình ảnh đang hoạt động
        ])
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(limit);

      if (!roomTypeMains || roomTypeMains.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có loại phòng chính nào" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: roomTypeMains,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === Lấy loại phòng theo ID ===
  getRoomTypeMainById: async (req, res) => {
    try {
      const roomTypeMain = await RoomTypeMainModel.findById(
        req.params.id
      ).populate([
        { path: "DanhSachLoaiPhong" },
        { path: "HinhAnh", select: "HinhAnh" },
      ]);
      if (!roomTypeMain) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }
      res.status(200).json({
        message: "Lấy loại phòng chính thành công",
        roomTypeMain: roomTypeMain,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === Thêm loại phòng ===
  addRoomTypeMain: async (req, res) => {
    try {
      const { TenLP, MoTa, HinhAnh = [] } = req.body;

      const newRoomTypeMain = new RoomTypeMainModel({
        TenLP,
        MoTa,
      });

      // Validate dữ liệu loại phòng chính
      const validation = await roomTypeMainCon.validateRoomTypeMain(
        newRoomTypeMain
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng chính
      if (Array.isArray(HinhAnh) && HinhAnh.length > 0) {
        const imageDocs = [];
        for (const imagePath of HinhAnh) {
          try {
            const newImage = new ImageModel({
              MaLP: newRoomTypeMain._id,
              HinhAnh: imagePath,
              Loai: "roomTypeMain",
              TrangThai: true,
            });
            const savedImage = await newImage.save();
            imageDocs.push(savedImage._id);
          } catch (error) {
            newRoomTypeMain.HinhAnh = imageDocs.filter((id) => id);
          }
        }
        newRoomTypeMain.HinhAnh = imageDocs;
      }

      const savedRoomTypeMain = await newRoomTypeMain.save();
      return res.status(200).json({
        message: "Thêm loại phòng chính thành công",
        data: savedRoomTypeMain,
      });
    } catch (error) {
      console.error("Lỗi khi thêm loại phòng chính:", error);
      return res.status(500).json({ message: "Lỗi server", error });
    }
  },

  // === Cập nhật loại phòng ===
  updateRoomTypeMain: async (req, res) => {
    try {
      const { HinhAnh = [] } = req.body;

      const roomTypeMainToUpdate = await RoomTypeMainModel.findById(
        req.params.id
      );
      if (!roomTypeMainToUpdate) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? roomTypeMainToUpdate.toObject()
          : { ...roomTypeMainToUpdate.toObject(), ...req.body };

      // Validate updated data
      const validation = await roomTypeMainCon.validateRoomTypeMain(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật RoomTypeMain
      await roomTypeMainToUpdate.updateOne({ $set: req.body });

      // Xử lý cập nhật hình ảnh nếu có trong req.body.images
      if (HinhAnh && Array.isArray(HinhAnh) && HinhAnh.length > 0) {
        try {
          // Xóa các hình ảnh cũ liên kết với roomTypeMain
          await ImageModel.deleteMany({
            MaLP: req.params.id,
          });

          // Thêm các hình ảnh mới
          const imageData = HinhAnh.map((image) => ({
            MaLP: req.params.id,
            HinhAnh: image,
            Loai: "roomTypeMain",
          }));

          await ImageModel.insertMany(imageData);
        } catch (imageError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật hình ảnh",
            error: imageError.message,
          });
        }
      }
      // Lấy lại dữ liệu loại phòng chính đã cập nhật
      const updatedRoomTypeMain = await RoomTypeMainModel.findById(
        req.params.id
      ).populate([{ path: "HinhAnh", select: "HinhAnh" }]);
      res.status(200).json({
        message: "Cập nhật loại phòng chính thành công",
        data: updatedRoomTypeMain,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === Xóa loại phòng ===
  deleteRoomTypeMain: async (req, res) => {
    try {
      const roomTypeMain = await RoomTypeMainModel.findById(req.params.id);
      if (!roomTypeMain) {
        return res
          .status(404)
          .json({ message: "Loại phòng chính không tồn tại" });
      }
      // Kiểm tra xem loại phòng có đang được sử dụng không
      const isUsed = await RoomTypeModel.findOne({ MaLP: req.params.id });
      if (isUsed) {
        return res.status(400).json({
          message: "Không thể xóa loại phòng này vì nó đang được sử dụng.",
        });
      }

      // Xóa các hình ảnh liên quan
      try {
        await ImageModel.deleteMany({ MaLP: req.params.id });
      } catch (imageError) {
        return res.status(400).json({
          message: "Lỗi khi xóa hình ảnh liên quan",
          error: imageError.message,
        });
      }

      await roomTypeMain.deleteOne();
      res.status(200).json({
        message: "Xóa loại phòng chính thành công",
        data: roomTypeMain,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = roomTypeMainCon;
