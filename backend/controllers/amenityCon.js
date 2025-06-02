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

  // === LẤY TẤT CẢ TIỆN NGHI ===
  getAllAmenities: async (req, res) => {
    try {
      const amenities = await AmenityModel.find().populate({
        path: "LoaiPhongSuDung", // Virtual field từ Amenity -> RoomType_Amenity
        populate: {
          path: "MaLP", // Trong bảng trung gian -> roomType
          model: "roomType",
        },
      });
      if (!amenities || amenities.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }
      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: amenities,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY TẤT CẢ TIỆN NGHI CHO USER ===
  getAllAmenitiesForUser: async (req, res) => {
    try {
      const amenities = await AmenityModel.find({ TrangThai: true })
        .select("-TrangThai")
        .populate({
          path: "LoaiPhongSuDung", // Virtual field từ Amenity -> RoomType_Amenity
          match: { TrangThai: true }, // Chỉ lấy những loại phòng đang hoạt động
          populate: {
            path: "MaLP", // Trong bảng trung gian -> roomType
            select: "-TrangThai", // Chỉ lấy tên và mã loại phòng
            model: "roomType",
          },
        });
      if (amenities.length === 0) {
        return res.status(404).json({ message: "Không có tiện nghi nào." });
      }
      res.status(200).json({
        message: "Lấy tất cả tiện nghi thành công",
        data: amenities,
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
