const Discount = require("../models/discount.model");

const discountController = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN KHUYẾN MÃI ===
  validateDiscount: async (discountData, discountId) => {
    const {
      name,
      description,
      type,
      value,
      start_day,
      end_day,
      quantity,
      limit,
    } = discountData;
    // Kiểm tra các trường bắt buộc
    if (
      !name ||
      !description ||
      !type ||
      value == null ||
      !start_day ||
      !end_day
    ) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin khuyến mãi.",
      };
    }

    // Kiểm tra độ dài chuỗi
    if (name.length > 100 || description.length > 500) {
      return { valid: false, message: "Tên hoặc mô tả khuyến mãi quá dài." };
    }

    // Kiểm tra trùng tên
    // ✅ Nếu đang update, bỏ qua chính mình trong check trùng tên
    const existing = await Discount.findOne({ name });
    if (
      existing &&
      (!discountId || existing._id.toString() !== discountId.toString())
    ) {
      return { valid: false, message: "Tên khuyến mãi đã tồn tại." };
    }

    // Kiểm tra loại khuyến mãi
    const allowedLoaiKM = ["Percentage", "Fixed Amount", "Service Discount"];
    if (!allowedLoaiKM.includes(type)) {
      return { valid: false, message: "Loại khuyến mãi không hợp lệ." };
    }

    if (limit && !["unlimited", "limited"].includes(limit)) {
      return { valid: false, message: "Giới hạn khuyến mãi không hợp lệ." };
    }

    // Kiểm tra số lượng nếu loại là "Limited"
    if (limit === "limited" && (quantity == null || quantity < 1)) {
      return {
        valid: false,
        message: "Số lượng giới hạn phải là số dương.",
      };
    } else if (limit === "unlimited" && quantity > 0) {
      return {
        valid: false,
        message: "Không thể đặt số lượng cho khuyến mãi không giới hạn.",
      };
    }

    // Kiểm tra giá trị theo loại khuyến mãi
    if (type === "Percentage" && (value < 0 || value > 100)) {
      return {
        valid: false,
        message: "Giá trị khuyến mãi phần trăm phải từ 0 đến 100.",
      };
    } else if (type !== "Percentage" && value < 0) {
      return {
        valid: false,
        message: "Giá trị khuyến mãi cố định phải là số dương.",
      };
    }

    // Kiểm tra ngày bắt đầu và kết thúc
    const startDate = new Date(start_day);
    const endDate = new Date(end_day);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return {
        valid: false,
        message: "Ngày bắt đầu hoặc kết thúc không hợp lệ.",
      };
    }

    if (startDate >= endDate) {
      return { valid: false, message: "Ngày kết thúc phải sau ngày bắt đầu." };
    }

    // Kiểm tra ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại (chỉ lấy ngày, không lấy giờ)
    // ✅ Không cần kiểm tra ngày kết thúc vì nó đã được kiểm tra là sau ngày bắt đầu
    // ✅ Chỉ cần so sánh ngày, không cần giờ
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chỉ ngày
    startDate.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chỉ ngày

    if (startDate < today) {
      return {
        valid: false,
        message: "Ngày bắt đầu phải lớn hơn hoặc bằng ngày hiện tại.",
      };
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
        sort = "createdAt",
        order = "desc",
        status,
        discountType,
      } = req.query;

      // Xây dựng bộ lọc
      const query = {};
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }
      if (discountType) {
        query.type = discountType;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [discounts, total] = await Promise.all([
        Discount.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .exec(),
        Discount.countDocuments(query),
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
        sort = "start_day",
        order = "desc",
        discountType,
      } = req.query;

      // Xây dựng bộ lọc
      const query = { status: true }; // Chỉ lấy khuyến mãi đang hoạt động
      if (discountType) {
        query.type = discountType;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Sắp xếp
      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [discounts, total] = await Promise.all([
        Discount.find(query)
          .sort(sortObj)
          .skip(skip)
          .limit(parseInt(limit))
          .select("-status -createdAt -updatedAt") // Loại bỏ các trường không cần thiết
          .exec(),
        Discount.countDocuments(query),
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
      const discountData = await Discount.findById(req.params.id);
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
      const newDiscount = new Discount(req.body);

      // Validate Discount data
      const validation = await discountController.validateDiscount(newDiscount);
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
      const discountToUpdate = await Discount.findById(req.params.id);
      if (!discountToUpdate) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      }

      // Nếu không có trường nào được gửi, dùng lại toàn bộ dữ liệu cũ
      const updatedData =
        Object.keys(req.body).length === 0
          ? discountToUpdate.toObject()
          : { ...discountToUpdate.toObject(), ...req.body };

      // Validate dữ liệu cập nhật (dùng validateDiscount bạn đã tạo)
      const validation = await discountController.validateDiscount(
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

  // === KÍCH HOẠT/VÔ HIỆU HOÁ KHUYẾN MÃI ===
  toggleDiscountStatus: async (req, res) => {
    try {
      const discountToToggle = await Discount.findById(req.params.id);
      if (!discountToToggle) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      }

      // Chỉ cho phép vô hiệu hoá nếu khuyến mãi chưa bắt đầu hoặc đã kết thúc
      const today = new Date();
      const startDate = new Date(discountToToggle.start_day);
      const endDate = new Date(discountToToggle.end_day);

      if (
        discountToToggle.status === true &&
        today >= startDate &&
        today <= endDate
      ) {
        return res.status(400).json({
          message: "Không thể vô hiệu hoá khuyến mãi đang hoạt động",
        });
      } else if (
        discountToToggle.status === false &&
        (today < startDate || today > endDate)
      ) {
        return res.status(400).json({
          message:
            "Không thể kích hoạt khuyến mãi đã kết thúc hoặc chưa bắt đầu",
        });
      }

      // Chuyển đổi trạng thái
      discountToToggle.status = !discountToToggle.status;
      await discountToToggle.save();

      res.status(200).json({
        message: `Khuyến mãi ${
          discountToToggle.status ? "đã được kích hoạt" : "đã bị vô hiệu hoá"
        }`,
        data: discountToToggle,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA KHUYẾN MÃI ===
  deleteDiscount: async (req, res) => {
    try {
      const discountToDelete = await Discount.findById(req.params.id);
      if (!discountToDelete) {
        return res.status(404).json({ message: "Khuyến mãi không tồn tại." });
      } else if (discountToDelete.status === true) {
        return res
          .status(400)
          .json({ message: "Không thể xoá khuyến mãi đang hoạt động" });
      }

      await Discount.findByIdAndDelete(req.params.id);

      res.status(200).json({
        message: "Xoá khuyến mãi thành công",
        data: discountToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = discountController;
