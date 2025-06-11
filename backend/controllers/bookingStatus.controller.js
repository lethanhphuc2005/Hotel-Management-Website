const { BookingStatus } = require("../models/status.model");

const bookingStatusController = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN TRẠNG THÁI ===
  validateBookingStatus: async (statusData, statusId) => {
    const { name } = statusData;
    // Kiểm tra tên trạng thái
    if (!name) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin trạng thái đặt phòng.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (name.length > 100) {
      return { valid: false, message: "Tên trạng thái đặt phòng quá dài." };
    }
    // Kiểm tra trùng tên
    const existing = await BookingStatus.findOne({
      name,
    });
    if (
      existing &&
      (!statusId || existing._id.toString() !== statusId.toString())
    ) {
      return { valid: false, message: "Tên trạng thái đặt phòng đã tồn tại." };
    }
    return { valid: true };
  },

  // === LẤY TẤT CẢ TRẠNG THÁI ===
  getAllBookingStatus: async (req, res) => {
    try {
      const status = await BookingStatus.find().populate("bookings");
      if (!status || status.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có trạng thái đặt phòng nào" });
      }
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TRẠNG THÁI THEO ID ===
  getBookingStatusById: async (req, res) => {
    try {
      const statusData = await BookingStatus.findById(req.params.id);
      if (!statusData) {
        return res
          .status(404)
          .json({ message: "Trạng thái đặt phòng không tồn tại" });
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
  addBookingStatus: async (req, res) => {
    try {
      const newBookingStatus = new BookingStatus(req.body);
      const validation = await bookingStatusController.validateBookingStatus(
        newBookingStatus
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      const saveBookingStatus = await newBookingStatus.save();
      res.status(200).json({
        message: "Thêm trạng thái đặt phòng thành công",
        data: saveBookingStatus,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT TRẠNG THÁI ===
  updateBookingStatus: async (req, res) => {
    try {
      const statusToUpdate = await BookingStatus.findById(req.params.id);
      if (!statusToUpdate) {
        return res
          .status(404)
          .json({ message: "Trạng thái đặt phòng không tồn tại" });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? statusToUpdate.toObject()
          : { ...statusToUpdate.toObject(), ...req.body };

      const validation = await bookingStatusController.validateBookingStatus(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await statusToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật trạng thái đặt phòng thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === KÍCH HOẠT/VÔ HIỆU HOÁ TRẠNG THÁI ===
  toggleBookingStatus: async (req, res) => {
    try {
      const statusToToggle = await BookingStatus.findById(req.params.id);
      if (!statusToToggle) {
        return res
          .status(404)
          .json({ message: "Trạng thái đặt phòng không tồn tại" });
      }

      // Chuyển đổi trạng thái
      statusToToggle.status = !statusToToggle.status;
      await statusToToggle.save();

      res.status(200).json({
        message: `Trạng thái đặt phòng đã ${
          statusToToggle.status ? "kích hoạt" : "vô hiệu hóa"
        } thành công`,
        data: statusToToggle,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA TRẠNG THÁI ===
  deleteBookingStatus: async (req, res) => {
    try {
      const statusToDelete = await BookingStatus.findById(req.params.id);
      if (!statusToDelete) {
        return res
          .status(404)
          .json({ message: "Trạng thái đặt phòng không tồn tại" });
      }

      // Kiểm tra xem trạng thái có đang hoạt động không
      if (statusToDelete.status) {
        return res
          .status(400)
          .json({ message: "Không thể xóa trạng thái đang hoạt động" });
      }

      await BookingStatus.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Xóa trạng thái đặt phòng thành công",
        data: statusToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = bookingStatusController;
