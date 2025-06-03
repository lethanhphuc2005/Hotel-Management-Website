const ServiceModel = require("../models/serviceModel");

const serviceCon = {
  // === KIỂM TRA ĐIỀU KIỆN DỊCH VỤ ===
  validateService: async (serviceData, serviceId) => {
    const { TenDV, GiaDV, MoTa, HinhAnh } = serviceData;

    if (!TenDV || !GiaDV || !MoTa || !HinhAnh) {
      return {
        valid: false,
        message: "Thiếu thông tin dịch vụ",
      };
    }

    if (typeof TenDV !== "string" || typeof MoTa !== "string") {
      return {
        valid: false,
        message: "Tên dịch vụ và mô tả phải là chuỗi",
      };
    }

    if (GiaDV < 0) {
      return {
        valid: false,
        message: "Giá dịch vụ không được nhỏ hơn 0",
      };
    }

    if (TenDV.length > 100 || MoTa.length > 500) {
      return {
        valid: false,
        message: "Tên hoặc mô tả dịch vụ quá dài",
      };
    }

    // Kiểm tra tên dịch vụ có bị trùng không
    const existingService = await ServiceModel.findOne({ TenDV });
    if (
      existingService &&
      (!serviceId || existingService._id.toString() !== serviceId.toString())
    ) {
      return { valid: false, message: "Tên dịch vụ đã tồn tại" };
    }

    return { valid: true };
  },

  // === LẤY DANH SÁCH DỊCH VỤ (PHÂN TRANG, TÌM KIẾM, SẮP XẾP, LỌC TRẠNG THÁI) ===
  getAllServices: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort = "GiaDV",
        order = "desc",
        status,
      } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { TenDV: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo trạng thái nếu có
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.TrangThai = true;
        else if (status === "false" || status === false)
          query.TrangThai = false;
      }

      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      const total = await ServiceModel.countDocuments(query);
      const services = await ServiceModel.find(query)
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit);

      if (!services || services.length === 0) {
        return res.status(404).json({ message: "Không có dịch vụ nào" });
      }

      res.status(200).json({
        message: "Lấy danh sách dịch vụ thành công",
        data: services,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY DỊCH VỤ CHO USER ===
  getAllServicesForUser: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        sort = "GiaDV",
        order = "desc",
      } = req.query;

      const query = { TrangThai: true }; // Chỉ lấy dịch vụ đang hoạt động
      if (search) {
        query.$or = [
          { TenDV: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      const total = await ServiceModel.countDocuments(query);
      const services = await ServiceModel.find(query)
        .select("-TrangThai") // Không trả về trường TrangThai cho người dùng
        .sort(sortObj)
        .skip((page - 1) * limit)
        .limit(limit);

      if (!services || services.length === 0) {
        return res.status(404).json({ message: "Không có dịch vụ nào" });
      }

      res.status(200).json({
        message: "Lấy danh sách dịch vụ thành công",
        data: services,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === LẤY DỊCH VỤ THEO ID ===
  getServiceById: async (req, res) => {
    try {
      const service = await ServiceModel.findById(req.params.id);
      if (!service) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại" });
      }

      res.status(200).json({
        message: "Lấy dịch vụ thành công",
        data: service,
      });
    } catch (error) {
      return { message: error.message };
    }
  },

  // === THÊM DỊCH VỤ MỚI ===
  addService: async (req, res) => {
    try {
      const newService = new ServiceModel(req.body);
      const validation = await serviceCon.validateService(newService);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      res.status(201).json({
        message: "Cập nhật phòng thành công",
        data: updatedRoom,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === CẬP NHẬT DỊCH VỤ ===
  updateService: async (req, res) => {
    try {
      const serviceToUpdate = await ServiceModel.findById(req.params.id);
      if (!serviceToUpdate) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? serviceToUpdate.toObject()
          : { ...serviceToUpdate.toObject(), ...req.body };

      const validation = await serviceCon.validateService(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const updatedService = await ServiceModel.findByIdAndUpdate(
        req.params.id,
        updatedData,
        { new: true }
      );
      res.status(200).json({
        message: "Cập nhật dịch vụ thành công",
        data: updatedService,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA DỊCH VỤ ===
  deleteService: async (req, res) => {
    try {
      const serviceToDelete = await ServiceModel.findById(req.params.id);
      if (!serviceToDelete) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại" });
      }

      // Kiểm tra xem dịch vụ có đang được sử dụng không
      if (serviceToDelete.TrangThai) {
        return res.status(400).json({
          message: "Không thể xóa dịch vụ đang hoạt động",
        });
      }

      await ServiceModel.findByIdAndDelete(req.params.id);
      res.status(200).json({
        message: "Xóa dịch vụ thành công",
        data: serviceToDelete,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = serviceCon;
