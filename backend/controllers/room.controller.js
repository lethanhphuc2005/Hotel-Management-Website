const Room = require("../models/room.model");
const RoomClass = require("../models/roomClass.model");
const { RoomStatus, BookingStatus } = require("../models/status.model");
const Booking = require("../models/booking.model");
const { BookingDetail } = require("../models/bookingDetail.model");

const roomController = {
  // === KIỂM TRA ĐIỀU KIỆN PHÒNG ===
  validateRoom: async (roomData, roomId) => {
    const { floor, name, room_class_id, room_status_id } = roomData;
    if (!floor || !name || !room_class_id || !room_status_id) {
      return { valid: false, message: "Vui lòng điền đầy đủ thông tin phòng" };
    }

    if (typeof name !== "string") {
      return { valid: false, message: "Tầng và tên phòng phải là chuỗi" };
    }

    if (typeof floor !== "number" || floor < 1) {
      return { valid: false, message: "Tầng phải là số nguyên dương" };
    }

    // Kiểm tra xem tên phòng đã tồn tại hay chưa
    const existing = await Room.findOne({ name }).select("_id").lean();
    if (
      existing &&
      (!roomId || existing._id.toString() !== roomId.toString())
    ) {
      return { valid: false, message: "Tên phòng đã tồn tại." };
    }

    // Kiểm tra xem loại phòng và trạng thái có tồn tại trong cơ sở dữ liệu không
    const roomTypeExists = await RoomClass.findById(room_class_id)
      .select("_id")
      .lean();
    if (!roomTypeExists) {
      return { valid: false, message: "Loại phòng không tồn tại." };
    }

    const statusExists = await RoomStatus.findById(room_status_id)
      .select("_id")
      .lean();
    if (!statusExists) {
      return { valid: false, message: "Trạng thái không tồn tại." };
    }

    return { valid: true };
  },

  // === LẤY DANH SÁCH PHÒNG VỚI TÌM KIẾM, PHÂN TRANG, SẮP XẾP, LỌC ===
  getAllRooms: async (req, res) => {
    try {
      const {
        search = "",
        limit = 10,
        page = 1,
        sort = "createdAt",
        order = "asc",
        status,
        floor,
        type,
        check_in_date,
        check_out_date,
      } = req.query;

      const query = {};

      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (status) {
        query.room_status_id = status;
      }

      if (type) {
        query.room_class_id = type;
      }

      if (floor) {
        const floorNumber = parseInt(floor);
        if (!isNaN(floorNumber) && floorNumber > 0) {
          query.floor = floorNumber;
        } else {
          return res
            .status(400)
            .json({ message: "Tầng phải là số nguyên dương" });
        }
      }

      // === Xử lý lọc phòng trống ===
      if (check_in_date && check_out_date) {
        const checkIn = new Date(check_in_date);
        const checkOut = new Date(check_out_date);

        const excludedStatuses = await BookingStatus.find({
          code: { $in: ["CANCELLED", "CHECKED_OUT"] },
        }).select("_id");

        const excludedStatusIds = excludedStatuses.map((s) => s._id);

        const bookings = await Booking.find({
          $or: [
            {
              check_in_date: { $lt: checkOut },
              check_out_date: { $gt: checkIn },
            },
          ],
          booking_status_id: { $nin: excludedStatusIds }, // Trạng thái huỷ
        }).select("_id");

        const bookingIds = bookings.map((b) => b._id);

        const bookedRoomIds = await BookingDetail.find({
          booking_id: { $in: bookingIds },
        }).distinct("room_id");

        if (bookedRoomIds.length > 0) {
          query._id = { $nin: bookedRoomIds }; // Loại các phòng đã được đặt
        }
      }

      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [rooms, total] = await Promise.all([
        Room.find(query)
          .populate("room_class room_status booking_count")
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit)),
        Room.countDocuments(query),
      ]);

      if (!rooms || rooms.length === 0) {
        return res.status(404).json({ message: "Không tìm thấy phòng nào" });
      }

      res.status(200).json({
        message: "Lấy danh sách phòng thành công",
        data: rooms,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy danh sách phòng", error });
    }
  },

  // API lấy booking của phòng theo tháng
  getRoomBookingCalendar: async (req, res) => {
    try {
      const { room_id, year, month } = req.query;
      if (!room_id || !year || !month) {
        return res.status(400).json({ message: "Thiếu tham số" });
      }

      // Khoảng thời gian đầu tháng đến cuối tháng
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0, 23, 59, 59);

      // 1. Tìm booking_id có room_id này
      const bookingDetails = await BookingDetail.find({ room_id }).select(
        "booking_id"
      );
      const bookingIds = bookingDetails.map((bd) => bd.booking_id);

      // 2. Tìm booking thỏa điều kiện thời gian và booking_id ở trên
      const cancelStatus = await BookingStatus.findOne({
        code: "CANCELLED",
      }).select("_id");
      if (!cancelStatus) {
        return res
          .status(404)
          .json({ message: "Trạng thái hủy không tồn tại" });
      }
      const bookings = await Booking.find({
        _id: { $in: bookingIds },
        booking_status_id: { $ne: cancelStatus._id }, // trạng thái hủy hoặc trạng thái không tính
        $or: [
          { check_in_date: { $lte: endDate, $gte: startDate } },
          { check_out_date: { $lte: endDate, $gte: startDate } },
          {
            check_in_date: { $lte: startDate },
            check_out_date: { $gte: endDate },
          },
        ],
      }).populate("booking_status");

      // Format dữ liệu cho calendar
      const events = bookings.map((b) => ({
        id: b._id,
        title: `Booking #${b._id}`,
        start: b.check_in_date,
        end: b.check_out_date,
        status: b.booking_status,
      }));

      res.status(200).json({ events });
    } catch (error) {
      res.status(500).json({ message: "Lỗi lấy lịch đặt phòng", error });
    }
  },

  // === LẤY THÔNG TIN PHÒNG THEO ID ===
  getRoomById: async (req, res) => {
    const roomId = req.params.id;
    try {
      const room = await Room.findById(roomId).populate(
        "room_class room_status booking_count"
      );
      if (!room) {
        return res.status(404).json({ message: "Không tìm thấy phòng" });
      }
      res.status(200).json({
        message: "Lấy thông tin phòng thành công",
        data: room,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy thông tin phòng", error });
    }
  },

  normalizeRoomData: (data) => {
    return {
      ...data,
      floor: Number(data.floor),
      bed_amount: Number(data.bed_amount),
      capacity: Number(data.capacity),
      price: Number(data.price),
      price_discount: Number(data.price_discount || 0),
    };
  },

  // === THÊM MỚI PHÒNG ===
  addRoom: async (req, res) => {
    try {
      const newRoom = new Room(req.body);
      const validation = await roomController.validateRoom(newRoom);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      // Chuyển đổi dữ liệu phòng sang định dạng chuẩn
      const normalizedData = roomController.normalizeRoomData(
        newRoom.toObject()
      );
      newRoom.set(normalizedData);

      await newRoom.save();
      res.status(201).json({
        message: "Thêm phòng thành công",
        data: newRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi thêm phòng", error });
    }
  },

  // === CẬP NHẬT THÔNG TIN PHÒNG ===
  updateRoom: async (req, res) => {
    try {
      const roomToUpdate = await Room.findById(req.params.id);
      if (!roomToUpdate) {
        return res.status(404).json({ message: "Không tìm thấy phòng" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? roomToUpdate.toObject()
          : {
              ...roomToUpdate.toObject(),
              ...roomController.normalizeRoomData(req.body),
            };

      const validation = await roomController.validateRoom(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await roomToUpdate.updateOne(updatedData);
      const updatedRoom = await Room.findById(req.params.id).populate(
        "room_class room_status booking_count"
      );
      res.status(200).json({
        message: "Cập nhật phòng thành công",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật phòng", error });
    }
  },

  // === KÍCH HOẠT/ VÔ HIỆU HOÁ PHÒNG ===
  toggleRoomStatus: async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: "Không tìm thấy phòng" });
      }

      const { room_status_id } = req.body;
      if (!room_status_id) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp trạng thái phòng" });
      }

      room.room_status_id = room_status_id;
      await room.save();

      const updatedRoom = await Room.findById(req.params.id).populate(
        "room_class room_status booking_count"
      );

      res.status(200).json({
        message: "Thay đổi trạng thái phòng thành công",
        data: updatedRoom,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Lỗi khi thay đổi trạng thái phòng", error });
    }
  },

  // === XÓA PHÒNG ===
  deleteRoom: async (req, res) => {
    try {
      const roomToDelete = await Room.findById(req.params.id);
      if (!roomToDelete) {
        return res.status(404).json({ message: "Không tìm thấy phòng" });
      }

      // Kiểm tra xem phòng có đang được sử dụng hay không
      // (Giả sử có một mô hình khác liên kết với phòng, ví dụ: đặt phòng)
      // const isRoomInUse = await BookingModel.findOne({ roomId: roomToDelete._id });
      // if (isRoomInUse) {
      //   return res.status(400).json({ message: "Phòng đang được sử dụng, không thể xóa" });
      // }

      await roomToDelete.deleteOne();
      res.status(200).json({
        message: "Xóa phòng thành công",
        data: roomToDelete,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi xóa phòng", error });
    }
  },
};

module.exports = roomController;
