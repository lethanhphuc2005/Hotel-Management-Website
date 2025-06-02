const RoomTypeModel = require("../models/roomTypeModel");
const RoomTypeMainModel = require("../models/roomTypeMainModel");
const ImageModel = require("../models/imageModel");
const { RoomType_AmenityModel } = require("../models/amenityModel");

const roomTypeCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN LOẠI PHÒNG ===
  validateRoomType: async (roomTypeData, roomTypeId) => {
    const {
      MaLP,
      TenLPCT,
      View,
      MoTa,
      TrangThai,
      HinhAnh = [],
      TienNghi = [],
    } = roomTypeData;

    // Check required fields
    if (!TenLPCT || !MoTa || !View || !MaLP) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin loại phòng.",
      };
    }

    // Kiểm tra MaLP có tồn tại trong loại phòng chính không
    const mainRoomTypeExists = await RoomTypeMainModel.findById(MaLP).exec();
    if (!mainRoomTypeExists) {
      return { valid: false, message: "Mã loại phòng chính không hợp lệ." };
    }

    // Check string length
    if (TenLPCT.length > 100 || MoTa.length > 500) {
      return {
        valid: false,
        message: "Độ dài tên loại phòng hoặc mô tả không hợp lệ.",
      };
    }

    // Check for duplicate room type name
    const existing = await RoomTypeModel.findOne({ TenLPCT });
    if (
      existing &&
      (!roomTypeId || existing._id.toString() !== roomTypeId.toString())
    ) {
      return { valid: false, message: "Tên loại phòng đã tồn tại." };
    }

    // Check status
    if (typeof TrangThai !== "boolean") {
      return { valid: false, message: "Trạng thái phải là true hoặc false." };
    }
    // Check if the room type is active
    // if (roomTypeId) {
    //   const existingRoomType = await RoomTypeModel.findById(roomTypeId);
    //   if (existingRoomType && existingRoomType.TrangThai === true) {
    //     return {
    //       valid: false,
    //       message: "Không thể cập nhật loại phòng đang hoạt động.",
    //     };
    //   }
    // }

    // Check amenities if provided
    if (Array.isArray(TienNghi) && TienNghi.length > 0) {
      for (const amenity of TienNghi) {
        if (!amenity.MaTN || typeof amenity.MaTN !== "string") {
          return { valid: false, message: "Tiện nghi không hợp lệ." };
        }
        if (amenity.MaTN.length !== 24) {
          return { valid: false, message: "Mã tiện nghi không hợp lệ." };
        }
      }
    }

    // Check images if provided
    if (Array.isArray(HinhAnh) && HinhAnh.length > 0) {
      for (const imagePath of HinhAnh) {
        if (typeof imagePath !== "string" || imagePath.trim() === "") {
          return { valid: false, message: "Hình ảnh không hợp lệ." };
        }
      }
    }

    // Kiểm tra view
    const validViews = ["sea", "mountain", "city", "garden", "pool"];
    if (!validViews.includes(View)) {
      return {
        valid: false,
        message:
          "View không hợp lệ. Các giá trị hợp lệ: sea, mountain, city, garden, pool.",
      };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ LOẠI PHÒNG ===
  getAllRoomTypes: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        type,
        minPrice,
        maxPrice,
        amenity,
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      // Điều kiện ban đầu
      const searchCondition = {};
      if (search && search.trim() !== "") {
        searchCondition.TenLP = { $regex: search, $options: "i" };
      }

      if (type) {
        searchCondition.MaLP = type;
      }

      if (minPrice || maxPrice) {
        searchCondition.GiaPhong = {};
        if (minPrice) searchCondition.GiaPhong.$gte = parseInt(minPrice, 10);
        if (maxPrice) searchCondition.GiaPhong.$lte = parseInt(maxPrice, 10);
      }

      // Lấy dữ liệu thô theo điều kiện cơ bản
      let roomTypes = await RoomTypeModel.find(searchCondition)
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limitNumber)
        .populate([
          { path: "LoaiPhong" },
          {
            path: "TienNghi",
            populate: {
              path: "MaTN",
              model: "amenity",
            },
          },
          { path: "HinhAnh", select: "HinhAnh" },
        ]);

      if (!roomTypes || roomTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      // Lọc theo tiện nghi nếu có
      let filteredRoomTypes = roomTypes;
      if (amenity) {
        const amenityList = Array.isArray(amenity) ? amenity : [amenity];
        filteredRoomTypes = roomTypes.filter((room) => {
          const roomAmenityIds = room.TienNghi.map(
            (tn) => tn.MaTN && tn.MaTN._id.toString()
          );
          return amenityList.every((id) => roomAmenityIds.includes(id));
        });
      }

      if (filteredRoomTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        total: filteredRoomTypes.length,
        page: pageNumber,
        limit: limitNumber,
        data: filteredRoomTypes,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY TẤT CẢ LOẠI PHÒNG CHO USER ===
  getAllRoomTypesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        type,
        minPrice,
        maxPrice,
        amenity,
      } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);
      const skip = (pageNumber - 1) * limitNumber;

      // Điều kiện ban đầu
      const searchCondition = {};
      if (search && search.trim() !== "") {
        searchCondition.TenLP = { $regex: search, $options: "i" };
      }

      if (type) {
        searchCondition.MaLP = type;
      }

      if (minPrice || maxPrice) {
        searchCondition.GiaPhong = {};
        if (minPrice) searchCondition.GiaPhong.$gte = parseInt(minPrice, 10);
        if (maxPrice) searchCondition.GiaPhong.$lte = parseInt(maxPrice, 10);
      }

      // Lấy dữ liệu thô theo điều kiện cơ bản
      let roomTypes = await RoomTypeModel.find(searchCondition)
        .sort({ _id: -1 })
        .select("-TrangThai") // Không trả về trường TrangThai
        .skip(skip)
        .limit(limitNumber)
        .populate([
          { path: "LoaiPhong", select: "-TrangThai" }, // Không trả về trường TrangThai
          {
            path: "TienNghi",
            populate: {
              path: "MaTN",
              model: "amenity",
              select: "-TrangThai", // Không trả về trường TrangThai
            },
          },
          { path: "HinhAnh", select: "HinhAnh" },
        ]);

      if (!roomTypes || roomTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      // Lọc theo tiện nghi nếu có
      let filteredRoomTypes = roomTypes;
      if (amenity) {
        const amenityList = Array.isArray(amenity) ? amenity : [amenity];
        filteredRoomTypes = roomTypes.filter((room) => {
          const roomAmenityIds = room.TienNghi.map(
            (tn) => tn.MaTN && tn.MaTN._id.toString()
          );
          return amenityList.every((id) => roomAmenityIds.includes(id));
        });
      }

      if (filteredRoomTypes.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        total: filteredRoomTypes.length,
        page: pageNumber,
        limit: limitNumber,
        data: filteredRoomTypes,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY LOẠI PHÒNG THEO ID ===
  getRoomTypeById: async (req, res) => {
    try {
      const roomTypeData = await RoomTypeModel.find({
        _id: req.params.id,
      }).populate([
        { path: "LoaiPhong" },
        {
          path: "TienNghi",
          populate: {
            path: "MaTN",
            model: "amenity",
          },
        },
        { path: "HinhAnh", select: "HinhAnh" },
      ]);
      if (!roomTypeData || roomTypeData.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }
      res.status(200).json({
        message: "Lấy loại phòng thành công",
        data: roomTypeData,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

    // === THÊM LOẠI PHÒNG MỚI ===
  addRoomType: async (req, res) => {
    try {
      const { TenLPCT, MoTa, MaLP, HinhAnh = [], TienNghi = [] } = req.body;
      const newRoomType = new RoomTypeModel({
        TenLPCT: TenLPCT,
        MoTa: MoTa,
        SoGiuong: req.body.SoGiuong || 1, // Mặc định 1 giường nếu không có
        GiaPhong: req.body.GiaPhong || 0, // Mặc định 0 nếu không có
        View: req.body.View || "city", // Mặc định view là city nếu không có
        TrangThai: req.body.TrangThai || false, // Mặc định trạng thái là false nếu không có
        MaLP: MaLP, // Mã loại phòng chính
      });
      console.log("New Room Type Data:", newRoomType);
      const validation = await roomTypeCon.validateRoomType(newRoomType);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng
      if (Array.isArray(HinhAnh) && HinhAnh.length > 0) {
        const imageDocs = [];
        for (const imagePath of HinhAnh) {
          try {
            const newImage = new ImageModel({
              MaLP: newRoomType._id,
              HinhAnh: imagePath,
              Loai: "roomType",
              TrangThai: true,
            });
            const savedImage = await newImage.save();
            imageDocs.push(savedImage._id);
          } catch (error) {
            newRoomType.HinhAnh = imageDocs.filter((id) => id);
          }
        }
        newRoomType.HinhAnh = imageDocs;
      }

      // Nếu có tiện nghi: lưu vào bảng tiện nghi & gán vào TienNghi của loại phòng chính
      if (Array.isArray(TienNghi) && TienNghi.length > 0) {
        const amenities = [];
        for (const amenity of TienNghi) {
          try {
            const newAmenity = new RoomType_AmenityModel({
              MaLP: newRoomType._id,
              MaTN: amenity.MaTN,
            });
            const savedAmenity = await newAmenity.save();
            amenities.push(savedAmenity._id);
          } catch (error) {
            return res.status(500).json({ message: error.message });
          }
        }
        newRoomType.TienNghi = amenities;
      }

      await newRoomType.save();
      res.status(201).json({
        message: "Thêm loại phòng thành công",
        data: newRoomType,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === CẬP NHẬT LOẠI PHÒNG ===
  updateRoomType: async (req, res) => {
    try {
      const { HinhAnh = [], TienNghi = [] } = req.body;
      const roomTypeToUpdate = await RoomTypeModel.findById(req.params.id);
      if (!roomTypeToUpdate) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? roomTypeToUpdate.toObject()
          : { ...roomTypeToUpdate.toObject(), ...req.body };

      const validation = await roomTypeCon.validateRoomType(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật hình ảnh
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
            Loai: "roomType",
          }));

          await ImageModel.insertMany(imageData);
        } catch (imageError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật hình ảnh",
            error: imageError.message,
          });
        }
      }

      // Cập nhật tiện nghi
      if (TienNghi && Array.isArray(TienNghi) && TienNghi.length > 0) {
        try {
          // Xóa các tiện nghi cũ liên kết với roomType
          await RoomType_AmenityModel.deleteMany({
            MaLP: req.params.id,
          });

          // Thêm các tiện nghi mới
          const amenitiesData = TienNghi.map((amenity) => ({
            MaLP: req.params.id,
            MaTN: amenity.MaTN,
          }));

          await RoomType_AmenityModel.insertMany(amenitiesData);
        } catch (amenityError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật tiện nghi",
            error: amenityError.message,
          });
        }
      }

      // Cập nhật các trường khác
      await roomTypeToUpdate.updateOne({ $set: req.body });
      // Lấy lại dữ liệu đã cập nhật
      const updatedRoomType = await RoomTypeModel.findById(
        req.params.id
      ).populate([
        { path: "LoaiPhong" },
        { path: "TienNghi", populate: { path: "MaTN", model: "amenity" } },
        { path: "HinhAnh", select: "HinhAnh" },
      ]);

      res.status(200).json({
        message: "Cập nhật loại phòng thành công",
        data: updatedRoomType,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA LOẠI PHÒNG ===
  deleteRoomType: async (req, res) => {
    try {
      const deletedRoomType = await RoomTypeModel.findById(req.params.id);
      if (!deletedRoomType) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng phù hợp" });
      }
      // Kiểm tra nếu loại phòng đang ở trạng thái hoạt động thì không cho phép xóa
      if (deletedRoomType.TrangThai === true) {
        return res.status(400).json({
          message: "Không thể xóa loại phòng đang hoạt động.",
        });
      }
      // Xóa loại phòng
      await RoomTypeModel.findByIdAndDelete(req.params.id);

      // Xóa các hình ảnh liên quan
      try {
        await ImageModel.deleteMany({ MaLP: req.params.id });
      } catch (imgError) {
        return res.status(500).json({
          message: "Lỗi khi xóa hình ảnh liên quan",
          error: imgError.message,
        });
      }
      // Xóa các tiện nghi liên quan
      try {
        await RoomType_AmenityModel.deleteMany({ MaLP: req.params.id });
      } catch (amenityError) {
        return res.status(500).json({
          message: "Lỗi khi xóa tiện nghi liên quan",
          error: amenityError.message,
        });
      }

      res.status(200).json({
        message: "Xóa loại phòng thành công",
        data: deletedRoomType,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  },
};

module.exports = roomTypeCon;
