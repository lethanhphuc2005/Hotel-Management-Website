const RoomModel = require("../models/roomModel");
const RoomTypeModel = require("../models/roomTypeModel");
const StatusModel = require("../models/statusModel");

const roomCon = {
  // === KIỂM TRA ĐIỀU KIỆN PHÒNG ===
  validateRoom: async (roomData, roomId) => {
    const { Tang, TenPhong, MaLP, MaTT } = roomData;

    if (!Tang || !TenPhong || !MaLP || !MaTT) {
      return { valid: false, message: "Vui lòng điền đầy đủ thông tin phòng" };
    }

    if (typeof Tang !== "string" || typeof TenPhong !== "string") {
      return { valid: false, message: "Tầng và tên phòng phải là chuỗi" };
    }

    // Kiểm tra xem tên phòng đã tồn tại hay chưa
    const existing = await RoomModel.findOne({ TenPhong });
    if (
      existing &&
      (!roomId || existing._id.toString() !== roomId.toString())
    ) {
      return { valid: false, message: "Tên phòng đã tồn tại." };
    }

    // Kiểm tra xem loại phòng và trạng thái có tồn tại trong cơ sở dữ liệu không
    const roomTypeExists = await RoomTypeModel.findById(MaLP);
    if (!roomTypeExists) {
      return { valid: false, message: "Loại phòng không tồn tại." };
    }

    const statusExists = await StatusModel.findById(MaTT);
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
        sort = "TenPhong",
        order = "asc",
        status,
        type,
      } = req.query;

      const query = {};

      // Tìm kiếm theo tên phòng (không phân biệt hoa thường)
      if (search) {
        query.$or = [
          { TenPhong: { $regex: search, $options: "i" } },
          { Tang: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo trạng thái
      if (status) {
        query.MaTT = status;
      }

      // Lọc theo loại phòng
      if (type) {
        query.MaLP = type;
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "desc" ? -1 : 1;

      const rooms = await RoomModel.find(query)
        .populate([{ path: "LoaiPhong" }, { path: "TrangThai" }])
        .sort(sortOption)
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));

      const total = await RoomModel.countDocuments(query);

      res.status(200).json({
        message: "Lấy danh sách phòng thành công",
        data: rooms,
        pagination: {
          total,
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
      const room = await RoomModel.findById(roomId).populate([
        { path: "LoaiPhong" },
        { path: "TrangThai" },
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
      const newRoom = new RoomModel(req.body);
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
      const roomToUpdate = await RoomModel.findById(req.params.id);
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
      const updatedRoom = await RoomModel.findById(req.params.id).populate([
        { path: "LoaiPhong" },
        { path: "TrangThai" },
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
      const roomToDelete = await RoomModel.findById(req.params.id);
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
