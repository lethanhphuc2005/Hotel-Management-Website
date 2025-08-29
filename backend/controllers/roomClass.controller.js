const RoomClass = require("../models/roomClass.model");
const MainRoomClass = require("../models/mainRoomClass.model");
const Image = require("../models/image.model");
const { Room_Class_Feature } = require("../models/feature.model");
const Room = require("../models/room.model");
const {
  deleteImagesOnError,
  deleteOldImages,
} = require("../middlewares/cloudinaryUpload.middleware");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const { BookingStatus } = require("../models/status.model");
const parseJSONFields = require("../utils/parseJSONFields.js");
const ObjectId = require("mongoose").Types.ObjectId;

const roomClassController = {
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
    const mainRoomClassExists = await MainRoomClass.findById(main_room_class_id)
      .select("_id")
      .lean();
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
    const existing = await RoomClass.findOne({ name }).select("_id").lean();
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

    // Kiểm tra view
    const validViews = [
      "biển",
      "thành phố",
      "núi",
      "vườn",
      "hồ bơi",
      "sông",
      "hồ",
    ];
    if (!validViews.includes(view)) {
      return {
        valid: false,
        message:
          "View không hợp lệ. Các giá trị hợp lệ: biển, thành phố, núi, vườn, hồ bơi, sông, hồ",
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
        minBed,
        maxBed,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        feature,
        view,
        sort = "createdAt",
        order = "desc",
        check_in_date,
        check_out_date,
      } = req.query;

      const query = {};

      // SEARCH
      if (search.trim()) {
        const safeSearch = search.trim().slice(0, 50);
        query.$or = [
          { name: { $regex: `^${safeSearch}`, $options: "i" } },
          { description: { $regex: `^${safeSearch}`, $options: "i" } },
        ];
      }

      // PRICE FILTER
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }

      // BED FILTER
      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed);
      }

      // VIEW
      if (view) {
        const viewList = Array.isArray(view) ? view : [view];
        query.view = { $in: viewList };
      }

      // MAIN ROOM CLASS TYPE
      if (type) {
        const typeList = Array.isArray(type) ? type : [type];
        query.main_room_class_id = { $in: typeList };
      }

      // FEATURE (embedded document)
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        const validFeatureIds = featureList
          .filter((id) => ObjectId.isValid(id))
          .map((id) => new ObjectId(id));

        const featureMatches = await Room_Class_Feature.find({
          feature_id: { $in: validFeatureIds },
        }).select("room_class_id");

        const matchedRoomClassIds = featureMatches.map((f) =>
          f.room_class_id.toString()
        );

        if (matchedRoomClassIds.length === 0) {
          return res.status(200).json({
            message:
              "Không tìm thấy loại phòng nào phù hợp với tiện nghi đã chọn",
            data: [],
          });
        }

        query._id = { $in: matchedRoomClassIds };
      }

      if (minCapacity) query["capacity"] = { $gte: parseInt(minCapacity) };
      if (maxCapacity)
        query["capacity"] = {
          ...query["capacity"],
          $lte: parseInt(maxCapacity),
        };

      const sortObj = { [sort]: order === "asc" ? 1 : -1 };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const perPage = parseInt(limit);

      let roomClasses = await RoomClass.find(query)
        .sort(sortObj)
        .populate(["main_room_class", "features", "images"]);

      // CHECK ROOM AVAILABILITY
      if (check_in_date && check_out_date) {
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);

        const excludedStatuses = await BookingStatus.find({
          code: { $in: ["CANCELLED", "CHECKED_OUT"] },
        }).select("_id");
        const excludedStatusIds = excludedStatuses.map((s) => s._id);

        const bookings = await Booking.find({
          check_in_date: { $lt: checkOut },
          check_out_date: { $gt: checkIn },
          booking_status_id: { $nin: excludedStatusIds },
        }).select("_id check_in_date check_out_date");

        const bookingIds = bookings.map((b) => b._id);

        const bookingDetails = await BookingDetail.find({
          booking_id: { $in: bookingIds },
        }).select("room_class_id booking_id");

        const totalRoomsByClass = await Room.aggregate([
          {
            $group: {
              _id: "$room_class_id",
              total: { $sum: 1 },
            },
          },
        ]);

        const totalRoomsMap = {};
        totalRoomsByClass.forEach((r) => {
          totalRoomsMap[r._id.toString()] = r.total;
        });

        const bookedCountMap = {};
        const dateCache = {};

        const getDatesBetween = (start, end) => {
          const key = `${start.toISOString()}_${end.toISOString()}`;
          if (dateCache[key]) return dateCache[key];

          const dates = [];
          let current = new Date(start);
          while (current < end) {
            dates.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
          }
          dateCache[key] = dates;
          return dates;
        };

        bookingDetails.forEach((detail) => {
          const roomClassId = detail.room_class_id.toString();
          const booking = bookings.find((b) => b._id.equals(detail.booking_id));
          if (!booking) return;

          const bookedDates = getDatesBetween(
            booking.check_in_date,
            booking.check_out_date
          );

          if (!bookedCountMap[roomClassId]) bookedCountMap[roomClassId] = {};

          bookedDates.forEach((date) => {
            bookedCountMap[roomClassId][date] =
              (bookedCountMap[roomClassId][date] || 0) + 1;
          });
        });

        const datesToCheck = getDatesBetween(checkIn, checkOut);
        const beforeCount = roomClasses.length;

        roomClasses = roomClasses.filter((rc) => {
          const rcId = rc._id.toString();
          const totalRoom = totalRoomsMap[rcId] || 0;
          if (totalRoom === 0) return false;

          const isAvailable = datesToCheck.every((date) => {
            const booked = bookedCountMap[rcId]?.[date] || 0;
            return booked < totalRoom;
          });

          return isAvailable;
        });
      }

      if (!roomClasses.length) {
        return res
          .status(200)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp", data: [] });
      }

      const totalMatchingRoomCount = roomClasses.length;
      const paginatedRoomClasses = roomClasses.slice(skip, skip + perPage);

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: paginatedRoomClasses,
        pagination: {
          total: totalMatchingRoomCount,
          page: parseInt(page),
          limit: perPage,
          totalPages: Math.ceil(totalMatchingRoomCount / perPage),
        },
      });
    } catch (error) {
      console.error(">>> Server error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  getAllRoomClassesForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        type,
        minBed,
        maxBed,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        feature,
        view,
        sort = "createdAt",
        order = "desc",
        check_in_date,
        check_out_date,
      } = req.query;

      const query = { status: true };

      // SEARCH
      if (search.trim()) {
        const safeSearch = search.trim().slice(0, 50);
        query.$or = [
          { name: { $regex: `^${safeSearch}`, $options: "i" } },
          { description: { $regex: `^${safeSearch}`, $options: "i" } },
        ];
      }

      // PRICE FILTER
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }

      // BED FILTER
      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed);
      }

      // VIEW
      if (view) {
        const viewList = Array.isArray(view) ? view : [view];
        query.view = { $in: viewList };
      }

      // MAIN ROOM CLASS TYPE
      if (type) {
        const typeList = Array.isArray(type) ? type : [type];
        query.main_room_class_id = { $in: typeList };
      }

      // FILTER BY FEATURES (from RoomClassFeature collection)
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        const validFeatureIds = featureList
          .filter((id) => ObjectId.isValid(id))
          .map((id) => new ObjectId(id));

        const featureMatches = await Room_Class_Feature.find({
          feature_id: { $in: validFeatureIds },
        }).select("room_class_id feature_id");

        const matchedRoomClassIds = featureMatches.map((f) =>
          f.room_class_id.toString()
        );

        if (matchedRoomClassIds.length === 0) {
          return res.status(200).json({
            message:
              "Không tìm thấy loại phòng nào phù hợp với tiện nghi đã chọn",
            data: [],
          });
        }

        query._id = { $in: matchedRoomClassIds };
      }

      if (minCapacity) query.capacity = { $gte: parseInt(minCapacity) };
      if (maxCapacity)
        query.capacity = {
          ...query.capacity,
          $lte: parseInt(maxCapacity),
        };

      const sortObj = { [sort]: order === "asc" ? 1 : -1 };

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const perPage = parseInt(limit);

      let roomClasses = await RoomClass.find(query)
        .sort(sortObj)
        .populate(["main_room_class", "features", "images"]);

      // CHECK ROOM AVAILABILITY
      if (check_in_date && check_out_date) {
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);

        const excludedStatuses = await BookingStatus.find({
          code: { $in: ["CANCELLED", "CHECKED_OUT"] },
        }).select("_id");
        const excludedStatusIds = excludedStatuses.map((s) => s._id);

        const bookings = await Booking.find({
          check_in_date: { $lt: checkOut },
          check_out_date: { $gt: checkIn },
          booking_status_id: { $nin: excludedStatusIds },
        }).select("_id check_in_date check_out_date");

        const bookingIds = bookings.map((b) => b._id);

        const bookingDetails = await BookingDetail.find({
          booking_id: { $in: bookingIds },
        }).select("room_class_id booking_id");

        const totalRoomsByClass = await Room.aggregate([
          {
            $group: {
              _id: "$room_class_id",
              total: { $sum: 1 },
            },
          },
        ]);

        const totalRoomsMap = {};
        totalRoomsByClass.forEach((r) => {
          totalRoomsMap[r._id.toString()] = r.total;
        });

        const bookedCountMap = {};
        const dateCache = {};

        const getDatesBetween = (start, end) => {
          const key = `${start.toISOString()}_${end.toISOString()}`;
          if (dateCache[key]) return dateCache[key];

          const dates = [];
          let current = new Date(start);
          while (current < end) {
            dates.push(current.toISOString().slice(0, 10));
            current.setDate(current.getDate() + 1);
          }
          dateCache[key] = dates;
          return dates;
        };

        bookingDetails.forEach((detail) => {
          const roomClassId = detail.room_class_id.toString();
          const booking = bookings.find((b) => b._id.equals(detail.booking_id));
          if (!booking) return;

          const bookedDates = getDatesBetween(
            booking.check_in_date,
            booking.check_out_date
          );

          if (!bookedCountMap[roomClassId]) bookedCountMap[roomClassId] = {};

          bookedDates.forEach((date) => {
            bookedCountMap[roomClassId][date] =
              (bookedCountMap[roomClassId][date] || 0) + 1;
          });
        });

        const datesToCheck = getDatesBetween(checkIn, checkOut);
        const beforeCount = roomClasses.length;

        roomClasses = roomClasses.filter((rc) => {
          const rcId = rc._id.toString();
          const totalRoom = totalRoomsMap[rcId] || 0;
          if (totalRoom === 0) return false;

          const isAvailable = datesToCheck.every((date) => {
            const booked = bookedCountMap[rcId]?.[date] || 0;
            return booked < totalRoom;
          });

          return isAvailable;
        });
      }

      if (!roomClasses.length) {
        return res
          .status(200)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp", data: [] });
      }

      const totalMatchingRoomCount = roomClasses.length;
      const paginatedRoomClasses = roomClasses.slice(skip, skip + perPage);

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: paginatedRoomClasses,
        pagination: {
          total: totalMatchingRoomCount,
          page: parseInt(page),
          limit: perPage,
          totalPages: Math.ceil(totalMatchingRoomCount / perPage),
        },
      });
    } catch (error) {
      console.error(">>> Server error:", error);
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY LOẠI PHÒNG THEO ID ===
  getRoomClassById: async (req, res) => {
    try {
      const roomClassData = await RoomClass.findById(req.params.id).populate(
        "main_room_class features images rooms comments reviews"
      );
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
      parseJSONFields(req.body, ["bed", "features"]);
      const { features = [] } = req.body;
      const newRoomClass = new RoomClass(req.body);
      const validation = await roomClassController.validateRoomClass(
        newRoomClass
      );
      if (!validation.valid) {
        if (req.files && req.files.length > 0) {
          deleteImagesOnError(req.files);
        }
        return res.status(400).json({ message: validation.message });
      }

      // Nếu có hình ảnh: lưu vào bảng hình ảnh & gán vào HinhAnh của loại phòng
      if (Array.isArray(req.files) && req.files.length > 0) {
        for (const file of req.files) {
          const newImage = new Image({
            url: file.path, // ví dụ: 'room_class/abc.jpg'
            public_id: file.filename, // public_id từ Cloudinary
            target: "room_class",
            target_id: newRoomClass._id,
          });
          await newImage.save();
        }
      }

      // Nếu có tiện nghi: lưu vào bảng tiện nghi & gán vào features của loại phòng chính
      if (Array.isArray(features) && features.length > 0) {
        const featureDocs = [];
        for (const featureId of features) {
          try {
            const newFeature = new Room_Class_Feature({
              room_class_id: newRoomClass._id,
              feature_id: featureId,
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
      if (req.files && req.files.length > 0) {
        deleteImagesOnError(req.files);
      }
      res.status(500).json({ message: error.message });
    }
  },

  // === CẬP NHẬT LOẠI PHÒNG ===
  updateRoomClass: async (req, res) => {
    try {
      parseJSONFields(req.body, ["bed", "features"]);
      let features = req.body.features || [];
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

      const validation = await roomClassController.validateRoomClass(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        if (req.files && req.files.length > 0) {
          deleteImagesOnError(req.files);
        }
        return res.status(400).json({ message: validation.message });
      }

      // Cập nhật hình ảnh
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        const oldImages = await Image.find({
          target: "room_class",
          target_id: roomClassToUpdate._id,
        });

        if (oldImages && oldImages.length > 0) {
          const oldImagePaths = oldImages.map((img) => img.public_id); // ví dụ: "/images/abc.jpg"
          deleteOldImages(oldImagePaths); // dùng hàm hỗ trợ bạn đã viết

          // Xóa các hình ảnh cũ liên kết với roomClassMain
          await Image.deleteMany({
            target: "room_class",
            target_id: roomClassToUpdate._id,
          });

          // Thêm các hình ảnh mới
          const imageData = req.files.map((file) => ({
            url: file.path, // ví dụ: 'room_class/abc.jpg'
            public_id: file.filename, // public_id từ Cloudinary
            target: "room_class",
            target_id: roomClassToUpdate._id,
          }));

          await Image.insertMany(imageData);
        } else {
          // Nếu không có hình ảnh cũ, chỉ cần thêm hình ảnh mới
          const imageData = req.files.map((file) => ({
            url: file.path, // ví dụ: 'room_class/abc.jpg'
            public_id: file.filename, // public_id từ Cloudinary
            target: "room_class",
            target_id: roomClassToUpdate._id,
          }));

          await Image.insertMany(imageData);
        }
      }

      if (features && Array.isArray(features) && features.length > 0) {
        try {
          // Xóa các tiện nghi cũ liên kết với roomClass
          await Room_Class_Feature.deleteMany({
            room_class_id: req.params.id,
          });

          // Thêm các tiện nghi mới
          const featuresData = features.map((feature) => ({
            room_class_id: req.params.id,
            feature_id: feature,
          }));

          await Room_Class_Feature.insertMany(featuresData);
        } catch (featureError) {
          return res.status(400).json({
            message: "Lỗi khi cập nhật tiện nghi",
            error: featureError.message,
          });
        }
      }

      const updatedRoomClass = await roomClassToUpdate.updateOne({
        $set: req.body,
      });

      res.status(200).json({
        message: "Cập nhật loại phòng thành công",
        data: updatedRoomClass,
      });
    } catch (error) {
      if (req.files && req.files.length > 0) {
        deleteImagesOnError(req.files);
      }
      res.status(500).json({ message: error.message });
    }
  },

  // === KÍCH HOẠT/ VÔ HIỆU HOÁ LOẠI PHÒNG ===
  toggleRoomClassStatus: async (req, res) => {
    try {
      const roomClassToToggle = await RoomClass.findById(req.params.id);
      if (!roomClassToToggle) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng phù hợp" });
      }

      // Kiểm tra nếu loại phòng có các phòng đang hoạt động thì không cho phép thay đổi trạng thái
      const bookedRoomStatusId = await BookingStatus.find({
        code: "BOOKED",
      }).select("_id");
      const roomsUsingThisClass = await Room.find({
        room_class_id: roomClassToToggle._id,
        room_status_id: { $in: bookedRoomStatusId },
      });
      if (roomsUsingThisClass.length > 0) {
        return res.status(400).json({
          message:
            "Không thể thay đổi trạng thái loại phòng này vì nó đang được sử dụng.",
        });
      }

      // Thay đổi trạng thái
      roomClassToToggle.status = !roomClassToToggle.status;
      await roomClassToToggle.save();

      res.status(200).json({
        message: `Loại phòng ${
          roomClassToToggle.status ? "đã được kích hoạt" : "đã bị vô hiệu hóa"
        }`,
        data: roomClassToToggle,
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

module.exports = roomClassController;
