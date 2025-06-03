const StatusModel = require("../models/statusModel");

const statusCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN TRẠNG THÁI ===
  validateStatus: async (statusData, statusId) => {
    const { TenTT, LoaiTT } = statusData;
    // Kiểm tra tên trạng thái
    if (!TenTT || !LoaiTT) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin trạng thái.",
      };
    }
    // Kiểm tra độ dài chuỗi
    if (TenTT.length > 100) {
      return { valid: false, message: "Tên trạng thái quá dài." };
    }
    // Kiểm tra trùng tên
    const existing = await StatusModel.findOne({
      TenTT,
    });
    if (
      existing &&
      (!statusId || existing._id.toString() !== statusId.toString())
    ) {
      return { valid: false, message: "Tên trạng thái đã tồn tại." };
    }
    return { valid: true };
  },

  // === LẤY TẤT CẢ TRẠNG THÁI ===
  getAllStatus: async (req, res) => {
    try {
      const status = await StatusModel.find();
      if (!status || status.length === 0) {
        return res.status(404).json({ message: "Không có trạng thái nào" });
      }
      res.status(200).json(status);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TRẠNG THÁI THEO ID ===
  getStatusById: async (req, res) => {
    try {
      const statusData = await StatusModel.findById(req.params.id);
      if (!statusData) {
        return res.status(404).json({ message: "Trạng thái không tồn tại" });
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
  addStatus: async (req, res) => {
    try {
      const newStatus = new StatusModel(req.body);
      const validation = await statusCon.validateStatus(newStatus);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }
      const saveStatus = await newStatus.save();
      res.status(200).json({
        message: "Thêm trạng thái thành công",
        data: saveStatus,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT TRẠNG THÁI ===
  updateStatus: async (req, res) => {
    try {
      const statusToUpdate = await StatusModel.findById(req.params.id);
      if (!statusToUpdate) {
        return res.status(404).json({ message: "Trạng thái không tồn tại" });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? statusToUpdate.toObject()
          : { ...statusToUpdate.toObject(), ...req.body };

      const validation = await statusCon.validateStatus(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await statusToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật trạng thái thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA TRẠNG THÁI ===
  deleteStatus: async (req, res) => {
    try {
      const statusToDelete = await StatusModel.findById(req.params.id);
      if (!statusToDelete) {
        return res.status(404).json({ message: "Trạng thái không tồn tại" });
      }
      // Kiểm tra xem trạng thái có đang được sử dụng hay không
      // Nếu có, không cho phép xóa
      // Ví dụ: nếu trạng thái này được sử dụng trong đơn hàng, bạn có thể kiểm tra như sau:
      // const ordersUsingStatus = await Order.find({ statusId: req.params.id });
      // if (ordersUsingStatus.length > 0) {
      //   return res.status(400).json({ message: "Trạng thái đang được sử dụng" });
      // }
      // Nếu không có đơn hàng nào sử dụng trạng thái này, tiến hành xóa
      // await Order.updateMany({ statusId: req.params.id }, { $unset: { statusId: "" } });
      // Xóa trạng thái
      // await Order.deleteMany({ statusId: req.params.id });

      await StatusModel.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Xóa trạng thái thành công",
        data: statusToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = statusCon;
