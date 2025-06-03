const discount = require("../models/discountModel");

const discountCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN KHUYẾN MÃI ===
  validateDiscount: async (discountData, discountId) => {
    const { TenKM, MoTa, LoaiKM, GiaTriKM, NgayBD, NgayKT } = discountData;
    // Kiểm tra các trường bắt buộc
    if (!TenKM || !MoTa || !LoaiKM || GiaTriKM == null || !NgayBD || !NgayKT) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin khuyến mãi.",
      };
    }

    // Kiểm tra độ dài chuỗi
    if (TenKM.length > 100 || MoTa.length > 500) {
      return { valid: false, message: "Tên hoặc mô tả khuyến mãi quá dài." };
    }

    // Kiểm tra trùng tên
    // ✅ Nếu đang update, bỏ qua chính mình trong check trùng tên
    const existing = await discount.findOne({ TenKM });
    if (
      existing &&
      (!discountId || existing._id.toString() !== discountId.toString())
    ) {
      return { valid: false, message: "Tên khuyến mãi đã tồn tại." };
    }
    // Kiểm tra giá trị khuyến mãi
    if (typeof GiaTriKM !== "number" || GiaTriKM <= 0) {
      return { valid: false, message: "Giá trị khuyến mãi phải là số dương." };
    }

    // Kiểm tra loại khuyến mãi
    const allowedLoaiKM = ["Percentage", "Fixed Amount", "Service Discount"];
    if (!allowedLoaiKM.includes(LoaiKM)) {
      return { valid: false, message: "Loại khuyến mãi không hợp lệ." };
    }

    // Kiểm tra ngày bắt đầu và kết thúc
    const startDate = new Date(NgayBD);
    const endDate = new Date(NgayKT);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        valid: false,
        message: "Ngày bắt đầu hoặc kết thúc không hợp lệ.",
      };
    }

    if (startDate >= endDate) {
      return { valid: false, message: "Ngày kết thúc phải sau ngày bắt đầu." };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ KHUYẾN MÃI (CÓ TÌM KIẾM, PHÂN TRANG, SẮP XẾP, LỌC) ===
  getAllDiscounts: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "NgayBD",
        order = "desc",
        status,
        discountType,
      } = req.query;

      // Xây dựng bộ lọc
      const query = {};
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.TrangThai = true;
        else if (status === "false" || status === false)
          query.TrangThai = false;
      }
      if (discountType) {
        query.LoaiKM = discountType;
      }
      if (search) {
        query.$or = [
          { TenKM: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [discounts, total] = await Promise.all([
        discount.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)),
        discount.countDocuments(query),
      ]);

      res.status(200).json({
        message: "Lấy tất cả khuyến mãi thành công",
        data: discounts,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY TẤT CẢ KHUYẾN MÃI CHO USER ===
  getAllDiscountsForUser: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "NgayBD",
        order = "desc",
        discountType,
      } = req.query;

      // Xây dựng bộ lọc
      const query = { TrangThai: true }; // Chỉ lấy khuyến mãi đang hoạt động
      if (discountType) {
        query.LoaiKM = discountType;
      }
      if (search) {
        query.$or = [
          { TenKM: { $regex: search, $options: "i" } },
          { MoTa: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [discounts, total] = await Promise.all([
        discount.find(query).sort(sortObj).skip(skip).limit(parseInt(limit)).select("-TrangThai"),
        discount.countDocuments(query),
      ]);

      res.status(200).json({
        message: "Lấy tất cả khuyến mãi thành công",
        data: discounts,
        pagination: {
          total: total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(total / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY KHUYẾN MÃI THEO ID ===
  getDiscountById: async (req, res) => {
    try {
      const discountData = await discount.findById(req.params.id);
      if (!discountData) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      }
      res.status(200).json({
        message: "Lấy khuyến mãi thành công",
        data: discountData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM KHUYẾN MÃI MỚI ===
  addDiscount: async (req, res) => {
    try {
      const newDiscount = new discount(req.body);

      // Validate discount data
      const validation = await discountCon.validateDiscount(newDiscount);
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      const saveDiscount = await newDiscount.save();
      res.status(200).json({
        message: "Thêm khuyến mãi thành công",
        data: saveDiscount,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT KHUYẾN MÃI ===
  updateDiscount: async (req, res) => {
    try {
      const discountToUpdate = await discount.findById(req.params.id);
      if (!discountToUpdate) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? discountToUpdate.toObject()
          : { ...discountToUpdate.toObject(), ...req.body };

      // Validate dữ liệu cập nhật (dùng validateDiscount bạn đã tạo)
      const validation = await discountCon.validateDiscount(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await discountToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật khuyến mãi thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA KHUYẾN MÃI ===
  deleteDiscount: async (req, res) => {
    try {
      const discountToDelete = await discount.findById(req.params.id);
      if (!discountToDelete) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      } else if (discountToDelete.TrangThai === true) {
        return res
          .status(400)
          .json({ message: "Không thể xoá khuyến mãi đang hoạt động" });
      }

      await discount.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Xoá khuyến mãi thành công",
        data: discountToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = discountCon;
