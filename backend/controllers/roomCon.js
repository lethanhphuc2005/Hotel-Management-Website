const Room = require("../models/roomModel");
const RoomClass = require("../models/roomClassModel");
const { RoomStatus } = require("../models/statusModel");

const roomCon = {
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
    const existing = await Room.findOne({ name });
    if (
      existing &&
      (!roomId || existing._id.toString() !== roomId.toString())
    ) {
      return { valid: false, message: "Tên phòng đã tồn tại." };
    }

    // Kiểm tra xem loại phòng và trạng thái có tồn tại trong cơ sở dữ liệu không
    const roomTypeExists = await RoomClass.findById(room_class_id);
    if (!roomTypeExists) {
      return { valid: false, message: "Loại phòng không tồn tại." };
    }

    const statusExists = await RoomStatus.findById(room_status_id);
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
        type,
      } = req.query;

      const query = {};

      // Tìm kiếm theo tên phòng (không phân biệt hoa thường)
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { floor: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo trạng thái
      if (status) {
        query.room_status_id = status;
      }

      // Lọc theo loại phòng
      if (type) {
        query.room_class_id = type;
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const rooms = await Room.find(query)
        .populate([{ path: "room_class" }, { path: "status" }])
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const total = await Room.countDocuments(query);

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

  // === LẤY THÔNG TIN PHÒNG THEO ID ===
  getRoomById: async (req, res) => {
    const roomId = req.params.id;
    try {
      const room = await Room.findById(roomId).populate([
        { path: "room_class" },
        { path: "status" },
      ]);
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

  // === THÊM MỚI PHÒNG ===
  addRoom: async (req, res) => {
    try {
      const newRoom = new Room(req.body);
      const validation = await roomCon.validateRoom(newRoom);

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

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
          : { ...roomToUpdate.toObject(), ...req.body };

      const validation = await roomCon.validateRoom(updatedData, req.params.id);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await roomToUpdate.updateOne(updatedData);
      const updatedRoom = await Room.findById(req.params.id).populate([
        { path: "room_class" },
        { path: "status" },
      ]);
      res.status(200).json({
        message: "Cập nhật phòng thành công",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi cập nhật phòng", error });
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

module.exports = roomCon;
