const { RoomStatus } = require("../models/status.model");
const Room = require("../models/room.model");

const roomStatusController = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN TRẠNG THÁI ===
  validateRoomStatus: async (statusData, statusId) => {
    const { name } = statusData;
    // Kiểm tra tên trạng thái
    if (!name) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin trạng thái phòng.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (name.length > 100) {
      return { valid: false, message: "Tên trạng thái phòng quá dài." };
    }
    // Kiểm tra trùng tên
    const existing = await RoomStatus.findOne({
      name,
    });
    if (
      existing &&
      (!statusId || existing._id.toString() !== statusId.toString())
    ) {
      return { valid: false, message: "Tên trạng thái phòng đã tồn tại." };
    }
    return { valid: true };
  },

  // === LẤY TẤT CẢ TRẠNG THÁI ===
  getAllRoomStatus: async (req, res) => {
    try {
      const status = await RoomStatus.find().populate("rooms");
      if (!status || status.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có trạng thái phòng nào" });
      }
      res.status(200).json({
        message: "Lấy tất cả trạng thái phòng thành công",
        data: status,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TRẠNG THÁI THEO ID ===
  getRoomStatusById: async (req, res) => {
    try {
      const statusData = await RoomStatus.findById(req.params.id).populate("rooms");
      if (!statusData) {
        return res
          .status(404)
          .json({ message: "Trạng thái phòng không tồn tại" });
      }
      res.status(200).json({
        message: "Lấy trạng thái thành công",
        data: statusData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM TRẠNG THÁI MỚI ===
  addRoomStatus: async (req, res) => {
    try {
      const newRoomStatus = new RoomStatus(req.body);
      const validation = await roomStatusController.validateRoomStatus(newRoomStatus);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      const saveRoomStatus = await newRoomStatus.save();
      res.status(200).json({
        message: "Thêm trạng thái phòng thành công",
        data: saveRoomStatus,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT TRẠNG THÁI ===
  updateRoomStatus: async (req, res) => {
    try {
      const statusToUpdate = await RoomStatus.findById(req.params.id);
      if (!statusToUpdate) {
        return res
          .status(404)
          .json({ message: "Trạng thái phòng không tồn tại" });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? statusToUpdate.toObject()
          : { ...statusToUpdate.toObject(), ...req.body };

      const validation = await roomStatusController.validateRoomStatus(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await statusToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật trạng thái phòng thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === KÍCH HOẠT/ VÔ HIỆU HOÁ TRẠNG THÁI ===
  toggleRoomStatus: async (req, res) => {
    try {
      const statusToToggle = await RoomStatus.findById(req.params.id);
      if (!statusToToggle) {
        return res
          .status(404)
          .json({ message: "Trạng thái phòng không tồn tại" });
      }

      const roomsUsingStatus = await Room.find({
        room_status_id: req.params.id,
      });

      // Kiểm tra xem trạng thái có đang được sử dụng trong phòng không
      if (roomsUsingStatus.length > 0 && statusToToggle.status) {
        return res
          .status(400)
          .json({ message: "Trạng thái đang được sử dụng trong phòng" });
      }

      statusToToggle.status = !statusToToggle.status;
      await statusToToggle.save();
      // Trả về trạng thái đã được cập nhật
      const updatedStatus = await RoomStatus.findById(req.params.id);
      res.status(200).json({
        message: `Trạng thái phòng ${
          statusToToggle.status ? "đã được kích hoạt" : "đã bị vô hiệu hóa"
        }`,
        data: updatedStatus,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA TRẠNG THÁI ===
  deleteRoomStatus: async (req, res) => {
    try {
      const statusToDelete = await RoomStatus.findById(req.params.id);
      if (!statusToDelete) {
        return res
          .status(404)
          .json({ message: "Trạng thái phòng không tồn tại" });
      }

      // Kiểm tra xem trạng thái có đang hoạt động không
      if (statusToDelete.status) {
        return res
          .status(400)
          .json({ message: "Không thể xóa trạng thái đang hoạt động" });
      }

      // Kiểm tra xem trạng thái có đang được sử dụng trong phòng không
      const roomsUsingStatus = await Room.find({ status: req.params.id });
      if (roomsUsingStatus.length > 0) {
        return res
          .status(400)
          .json({ message: "Trạng thái đang được sử dụng trong phòng" });
      }

      await RoomStatus.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Xóa trạng thái phòng thành công",
        data: statusToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = roomStatusController;
