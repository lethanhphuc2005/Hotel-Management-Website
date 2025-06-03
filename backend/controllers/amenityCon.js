const {
  AmenityModel,
  RoomType_AmenityModel,
} = require("../models/amenityModel");

const amenityCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN TIỆN NGHI ===
  validateAmenity: async (amenityData, amenityId) => {
    const { TenTN, MoTa, HinhAnh } = amenityData;

    // Check required fields
    if (!TenTN || !MoTa || !HinhAnh) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin tiện nghi.",
      };
    }

    // Check string length
    if (TenTN.length > 100 || MoTa.length > 500) {
      return { valid: false, message: "Tên hoặc mô tả tiện nghi quá dài." };
    }

    // Check for duplicate name
    const existing = await AmenityModel.findOne({ TenTN });
    if (
      existing &&
      (!amenityId || existing._id.toString() !== amenityId.toString())
    ) {
      return { valid: false, message: "Tên tiện nghi đã tồn tại." };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ TIỆN NGHI (CÓ TÌM KIẾM, PHÂN TRANG, SẮP XẾP, SẮP XẾP THEO TRẠNG THÁI) ===
  getAllAmenities: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "TenTN",
        order = "asc",
        status, // Thêm tham số lọc theo trạng thái
      } = req.query;

      // Tạo điều kiện tìm kiếm
      const query = {};
      if (search) {
        query.$or = [
          { TenTN: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.TrangThai = true;
        else if (status === "false" || status === false)
          query.TrangThai = false;
      }

      // Sắp xếp
      const sortOption = {};
      // Nếu sort là "TrangThai", cho phép sắp xếp theo trạng thái
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số tiện nghi (phục vụ phân trang)
      const total = await AmenityModel.countDocuments(query);

      // Lấy dữ liệu tiện nghi
      const amenities = await AmenityModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate({
          path: "LoaiPhongSuDung",
          populate: {
            path: "MaLP",
            model: "roomType",
          },
        });

      if (!amenities || amenities.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: amenities,
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
  getAllAmenitiesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "_id",
        order = "asc",
      } = req.query;

      // Tạo bộ lọc tìm kiếm
      const query = { TrangThai: true };
      if (search) {
        query.$or = [
          { TenTN: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "desc" ? -1 : 1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Lấy tổng số tiện nghi (phục vụ phân trang)
      const total = await AmenityModel.countDocuments(query);

      // Lấy dữ liệu tiện nghi
      const amenities = await AmenityModel.find(query)
        .sort(sortOption)
        .skip(skip)
        .select("-TrangThai") // Không trả về trường TrangThai cho người dùng
        .limit(parseInt(limit))
        .populate({
          path: "LoaiPhongSuDung",
          populate: {
            path: "MaLP",
            model: "roomType",
            match: { TrangThai: true }, // Chỉ lấy loại phòng đang hoạt động
            select: "-TrangThai", // Không trả về trường TrangThai của loại phòng
          },
        });

      if (!amenities || amenities.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }

      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: amenities,
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
  getAmenityById: async (req, res) => {
    try {
      const { id } = req.params;
      const amenity = await AmenityModel.findById(id).populate({
        path: "LoaiPhongSuDung", // Virtual field từ Amenity -> RoomType_Amenity
        populate: {
          path: "MaLP", // Trong bảng trung gian -> roomType
          model: "roomType",
        },
      });
      if (!amenity) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }
      res.status(200).json({
        message: "Lấy tiện nghi thành công",
        data: amenity,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === THÊM TIỆN NGHI MỚI ===
  addAmenity: async (req, res) => {
    try {
      const newAmenity = new AmenityModel(req.body);

      // Validate amenity data
      const validation = await amenityCon.validateAmenity(newAmenity);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await newAmenity.save();
      res.status(201).json({
        message: "Thêm tiện nghi thành công",
        data: newAmenity,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === CẬP NHẬT TIỆN NGHI ===
  updateAmenity: async (req, res) => {
    try {
      const amenityToUpdate = await AmenityModel.findById(req.params.id);
      if (!amenityToUpdate) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }

      // Nếu không có dữ liệu nào trong req.body, giữ nguyên tiện nghi hiện tại
      const updatedData =
        Object.keys(req.body).length === 0
          ? amenityToUpdate.toObject()
          : { ...amenityToUpdate.toObject(), ...req.body };

      // Kiểm tra dữ liệu trong req.body
      const validation = await amenityCon.validateAmenity(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật tiện nghi
      const updatedAmenity = await AmenityModel.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      ).populate({
        path: "LoaiPhongSuDung", // Virtual field từ Amenity -> RoomType_Amenity
        populate: {
          path: "MaLP", // Trong bảng trung gian -> roomType
          model: "roomType",
        },
      });

      if (!updatedAmenity) {
        return res
          .status(404)
          .json({ message: "Cập nhật tiện nghi thất bại." });
      }

      res.status(200).json({
        message: "Cập nhật tiện nghi thành công",
        data: updatedAmenity,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA TIỆN NGHI ===
  deleteAmenity: async (req, res) => {
    try {
      const amenityToDelete = await AmenityModel.findById(req.params.id);
      if (!amenityToDelete) {
        return res.status(404).json({ message: "Tiện nghi không tồn tại." });
      }

      // Kiểm tra xem tiện nghi có đang được sử dụng trong loại phòng nào không
      const isUsedInRoomType = await RoomType_AmenityModel.exists({
        MaTN: req.params.id,
      });
      if (isUsedInRoomType) {
        return res
          .status(400)
          .json({ message: "Tiện nghi đang được sử dụng trong loại phòng." });
      }

      // Xoá tiện nghi
      await AmenityModel.findByIdAndDelete(req.params.id);

      // Xoá tiện nghi khỏi bảng trung gian nếu có
      await RoomType_AmenityModel.deleteMany({ MaTN: req.params.id });

      res.status(200).json({
        message: "Xoá tiện nghi thành công",
        data: amenityToDelete,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = amenityCon;
