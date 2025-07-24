const RoomClass = require("../models/roomClass.model");
const MainRoomClass = require("../models/mainRoomClass.model");
const Image = require("../models/image.model");
const { Room_Class_Feature } = require("../models/feature.model");
const Room = require("../models/room.model");
const {
  upload,
  deleteImagesOnError,
  deleteOldImages,
} = require("../middlewares/upload.middleware");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");
const { BookingStatus } = require("../models/status.model");

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
        limit,
        type,
        minBed = 1,
        maxBed = 10,
        minCapacity,
        maxCapacity,
        minPrice,
        maxPrice,
        feature,
        status,
        sort = "createdAt",
        order = "desc",
        check_in_date,
        check_out_date,
      } = req.query;

      const query = {};

      if (search && search.trim() !== "") {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { view: { $regex: search, $options: "i" } },
        ];
      }
      if (type) query.main_room_class_id = type;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }
      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed);
      }
      if (minCapacity || maxCapacity) {
        query.capacity = {};
        if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
        if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
      }

      if (status) {
        query.status = status;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;
      const total = await RoomClass.countDocuments(query);

      let roomClasses = await RoomClass.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit))
        .populate([
          { path: "main_room_class" },
          { path: "features" },
          { path: "images", match: { status: true } },
          { path: "rooms" },
          { path: "comments" },
          { path: "reviews" },
        ])
        .exec();
      // --- Lọc theo tiện nghi
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        roomClasses = roomClasses.filter((room) => {
          const roomFeatureIds = room.features
            .map((f) => f.feature_id && f.feature_id._id.toString())
            .filter(Boolean);
          return featureList.every((id) => roomFeatureIds.includes(id));
        });
      }

      // --- Lọc theo ngày đặt phòng với kiểm tra phòng còn trống theo ngày
      if (check_in_date && check_out_date) {
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);
        const excludedStatuses = await BookingStatus.find({
          code: { $in: ["CANCELLED", "CHECKED_OUT"] },
        }).select("_id");

        const excludedStatusIds = excludedStatuses.map((s) => s._id);

        // Lấy tất cả booking nằm trong khoảng ngày check-in - check-out, trừ trạng thái huỷ
        const bookings = await Booking.find({
          check_in_date: { $lt: checkOut },
          check_out_date: { $gt: checkIn },
          booking_status_id: {
            $nin: excludedStatusIds,
          },
        });
        const bookingIds = bookings.map((b) => b._id);

        // Lấy chi tiết booking của các booking trên, có room_id
        const bookingDetails = await BookingDetail.find({
          booking_id: { $in: bookingIds },
        }).populate({
          path: "room_id",
          select: "room_class_id",
        });

        // Đếm tổng phòng của từng loại
        const totalRoomsByClass = await Room.aggregate([
          {
            $group: {
              _id: "$room_class_id",
              total: { $sum: 1 },
            },
          },
        ]);

        // Map: room_class_id => tổng phòng
        const totalRoomsMap = {};
        totalRoomsByClass.forEach((r) => {
          totalRoomsMap[r._id.toString()] = r.total;
        });

        // Tạo map đếm số phòng đã book từng ngày theo từng loại phòng
        // Format: { room_class_id: { "yyyy-mm-dd": count } }
        const bookedCountMap = {};

        // Hàm helper lấy các ngày trong khoảng
        const getDatesBetween = (start, end) => {
          const dates = [];
          let current = new Date(start);
          while (current < end) {
            dates.push(current.toISOString().slice(0, 10)); // yyyy-mm-dd
            current.setDate(current.getDate() + 1);
          }
          return dates;
        };

        // Duyệt booking details, đếm phòng booked theo ngày và loại phòng
        bookingDetails.forEach((detail) => {
          const roomClassId = detail.room_id.room_class_id.toString();
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

        // Giữ lại roomClasses có phòng trống đủ cho toàn bộ khoảng thời gian
        roomClasses = roomClasses.filter((rc) => {
          const rcId = rc._id.toString();
          const totalRoom = totalRoomsMap[rcId] || 0;
          if (totalRoom === 0) return false; // Không có phòng

          const dates = getDatesBetween(checkIn, checkOut);

          // Kiểm tra từng ngày xem số phòng đã booked < tổng phòng không
          return dates.every((date) => {
            const bookedCount = bookedCountMap[rcId]?.[date] || 0;
            return bookedCount < totalRoom;
          });
        });

        for (const rc of roomClasses) {
          const rcId = rc.id.toString();
          const totalRoom = await Room.countDocuments({ room_class_id: rcId });

          if (totalRoom === 0) {
            rc.rooms = [];
            continue;
          }

          const dates = getDatesBetween(checkIn, checkOut);

          rc.rooms = rc.rooms.filter((room) => {
            const isRoomBooked = bookingDetails.some((bd) => {
              if (!bd.room_id || !bd.room_id._id) return false;
              if (!bd.room_id._id.equals(room._id)) return false;

              const booking = bookings.find((b) => b._id.equals(bd.booking_id));
              if (!booking) return false;

              const bookedDates = getDatesBetween(
                booking.check_in_date,
                booking.check_out_date
              );

              return bookedDates.some((d) => dates.includes(d));
            });

            return !isRoomBooked;
          });
        }
      }

      if (!roomClasses.length) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: roomClasses, // chỉ trả về trang hiện tại
        pagination: {
          total, // tổng tất cả kết quả sau khi lọc
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
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
        sort = "createdAt",
        order = "desc",
        check_in_date,
        check_out_date,
      } = req.query;

      const query = { status: true };

      if (search && search.trim() !== "") {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { view: { $regex: search, $options: "i" } },
        ];
      }
      if (type) query.main_room_class_id = type;
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseInt(minPrice);
        if (maxPrice) query.price.$lte = parseInt(maxPrice);
      }
      if (minBed || maxBed) {
        query.bed_amount = {};
        if (minBed) query.bed_amount.$gte = parseInt(minBed);
        if (maxBed) query.bed_amount.$lte = parseInt(maxBed);
      }
      if (minCapacity || maxCapacity) {
        query.capacity = {};
        if (minCapacity) query.capacity.$gte = parseInt(minCapacity);
        if (maxCapacity) query.capacity.$lte = parseInt(maxCapacity);
      }

      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      let roomClasses = await RoomClass.find(query)
        .sort(sortObj)
        .populate([
          { path: "main_room_class", match: { status: true } },
          { path: "features" },
          { path: "images", match: { status: true } },
          { path: "rooms" },
          { path: "comments" },
          { path: "reviews" },
        ])
        .exec();
      // --- Lọc theo tiện nghi
      if (feature) {
        const featureList = Array.isArray(feature) ? feature : [feature];
        roomClasses = roomClasses.filter((room) => {
          const roomFeatureIds = room.features
            .map((f) => f.feature_id && f.feature_id._id.toString())
            .filter(Boolean);
          return featureList.every((id) => roomFeatureIds.includes(id));
        });
      }

      // --- Lọc theo ngày đặt phòng với kiểm tra phòng còn trống theo ngày
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
          booking_status_id: {
            $nin: excludedStatusIds,
          },
        });
        const bookingIds = bookings.map((b) => b._id);

        // Lấy chi tiết booking của các booking trên, có room_id
        const bookingDetails = await BookingDetail.find({
          booking_id: { $in: bookingIds },
        }).populate({
          path: "room_id",
          select: "room_class_id",
        });

        // Đếm tổng phòng của từng loại
        const totalRoomsByClass = await Room.aggregate([
          {
            $group: {
              _id: "$room_class_id",
              total: { $sum: 1 },
            },
          },
        ]);

        // Map: room_class_id => tổng phòng
        const totalRoomsMap = {};
        totalRoomsByClass.forEach((r) => {
          totalRoomsMap[r._id.toString()] = r.total;
        });

        // Tạo map đếm số phòng đã book từng ngày theo từng loại phòng
        // Format: { room_class_id: { "yyyy-mm-dd": count } }
        const bookedCountMap = {};

        // Hàm helper lấy các ngày trong khoảng
        const getDatesBetween = (start, end) => {
          const dates = [];
          let current = new Date(start);
          while (current < end) {
            dates.push(current.toISOString().slice(0, 10)); // yyyy-mm-dd
            current.setDate(current.getDate() + 1);
          }
          return dates;
        };

        // Duyệt booking details, đếm phòng booked theo ngày và loại phòng
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

        // Giữ lại roomClasses có phòng trống đủ cho toàn bộ khoảng thời gian
        roomClasses = roomClasses.filter((rc) => {
          const rcId = rc._id.toString();
          const totalRoom = totalRoomsMap[rcId] || 0;
          if (totalRoom === 0) return false; // Không có phòng

          const dates = getDatesBetween(checkIn, checkOut);

          // Kiểm tra từng ngày xem số phòng đã booked < tổng phòng không
          return dates.every((date) => {
            const bookedCount = bookedCountMap[rcId]?.[date] || 0;
            return bookedCount < totalRoom;
          });
        });
      }

      if (!roomClasses.length) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy loại phòng nào phù hợp" });
      }

      // === Phân trang sau khi lọc ===
      const total = roomClasses.length;
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const paginatedRoomClasses = roomClasses.slice(
        skip,
        skip + parseInt(limit)
      );

      res.status(200).json({
        message: "Lấy tất cả loại phòng thành công",
        data: paginatedRoomClasses,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY LOẠI PHÒNG THEO ID ===
  getRoomClassById: async (req, res) => {
    try {
      const roomClassData = await RoomClass.findById(req.params.id).populate([
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
        {
          path: "comments",
          select: "-status",
          populate: [
            {
              path: "user_id",
              select: "first_name last_name email phone_number",
            },
            {
              path: "employee_id",
              select: "first_name last_name email phone_number",
            },
          ],
        },
        {
          path: "reviews",
          select: "-status",
          populate: [
            {
              path: "user_id",
              select: "-address -status -createdAt -updatedAt",
            },
            {
              path: "employee_id",
              select: "-address -status -createdAt -updatedAt",
            },
          ],
        },
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
  addRoomClass: [
    upload.array("images", 5),
    async (req, res) => {
      try {
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
          const imageDocs = [];

          for (const file of req.files) {
            try {
              const newImage = new Image({
                room_class_id: newRoomClass._id,
                url: file.filename,
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
  ],

  // === CẬP NHẬT LOẠI PHÒNG ===
  updateRoomClass: [
    upload.array("images", 5),
    async (req, res) => {
      try {
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
          try {
            // Lấy danh sách ảnh cũ để xóa file vật lý
            const oldImages = await Image.find({
              room_class_id: req.params.id,
            });
            const oldImagePaths = oldImages.map((img) => img.url); // ví dụ: "/images/abc.jpg"
            deleteOldImages(oldImagePaths); // dùng hàm hỗ trợ bạn đã viết

            // Xóa các hình ảnh cũ liên kết với roomClassMain
            await Image.deleteMany({
              room_class_id: req.params.id,
            });

            // Thêm các hình ảnh mới
            const imageData = req.files.map((file) => ({
              room_class_id: req.params.id,
              url: file.filename,
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

        if (typeof features === "string") {
          try {
            features = JSON.parse(features); // Chuyển sang mảng thực sự
          } catch (err) {
            console.error("Parse JSON thất bại:", err);
            features = [];
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

        // Cập nhật các trường khác
        await roomClassToUpdate.updateOne({ $set: req.body });
        // Lấy lại dữ liệu đã cập nhật
        const updatedRoomClass = await RoomClass.findById(
          req.params.id
        ).populate([
          { path: "main_room_class" },
          {
            path: "features",
            populate: { path: "feature_id", model: "feature" },
          },
          { path: "images" },
        ]);

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
  ],

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
      const roomsUsingThisClass = await Room.find({
        room_class_id: roomClassToToggle._id,
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
