const BookingMethod = require("../models/bookingMethod.model");
const Booking = require("../models/booking.model");

const bookingMethodController = {
  // === KIỂM TRA ĐIỀU KIỆN PHƯƠNG THỨC ĐẶT PHÒNG ===
  validateBookingMethod: async (methodData, methodId) => {
    const { name, description } = methodData;

    if (!name || !description) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin phương thức đặt phòng.",
      };
    }

    if (typeof name !== "string" || typeof description !== "string") {
      return {
        valid: false,
        message: "Tên và mô tả phương thức phải là chuỗi.",
      };
    }

    if (name.length > 100 || description.length > 500) {
      return {
        valid: false,
        message: "Tên hoặc mô tả phương thức quá dài.",
      };
    }

    // Kiểm tra tên phương thức có bị trùng không
    const existingMethod = await BookingMethod.findOne({ name }).lean();
    if (
      existingMethod &&
      (!methodId || existingMethod._id.toString() !== methodId.toString())
    ) {
      return { valid: false, message: "Tên phương thức đã tồn tại." };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ PHƯƠNG THỨC ĐẶT PHÒNG (PHÂN TRANG, TÌM KIẾM, SẮP XẾP, LỌC TRẠNG THÁI) ===
  getAllBookingMethods: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "asc",
        status,
      } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }

      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const totalMethods = await BookingMethod.countDocuments(query);
      const methods = await BookingMethod.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("bookings")

      if (!methods || methods.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phương thức nào" });
      }

      res.status(200).json({
        message: "Lấy danh sách phương thức đặt phòng thành công",
        data: methods,
        pagination: {
          total: totalMethods,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalMethods / parseInt(limit)),
        },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY PHƯƠNG THỨC ĐẶT PHÒNG THEO ID ===
  getBookingMethodById: async (req, res) => {
    try {
      const method = await BookingMethod.findById(req.params.id)
        .populate("bookings")

      if (!method) {
        return res
          .status(404)
          .json({ message: "Phương thức đặt phòng không tồn tại" });
      }
      res.status(200).json({
        message: "Lấy phương thức đặt phòng thành công",
        data: method,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM PHƯƠNG THỨC ĐẶT PHÒNG ===
  addBookingMethod: async (req, res) => {
    try {
      const newMethod = new BookingMethod(req.body);

      const validation = await bookingMethodController.validateBookingMethod(
        newMethod
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await newMethod.save();

      res.status(201).json({
        message: "Thêm phương thức đặt phòng thành công",
        data: newMethod,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === BẬT/TẮT PHƯƠNG THỨC ĐẶT PHÒNG ===
  toggleBookingMethodStatus: async (req, res) => {
    try {
      const methodToToggle = await BookingMethod.findById(req.params.id)
        .populate("bookings")

        if (!methodToToggle) {
        return res
          .status(404)
          .json({ message: "Phương thức đặt phòng không tồn tại" });
      }

      // Nếu có phòng đặt thì không cho phép bật/tắt
      if (methodToToggle.bookings && methodToToggle.bookings.length > 0) {
        return res.status(400).json({
          message: "Không thể thay đổi trạng thái phương thức đã có phòng đặt.",
        });
      }

      methodToToggle.status = !methodToToggle.status;
      await methodToToggle.save();

      res.status(200).json({
        message: `Đã ${
          methodToToggle.status ? "bật" : "tắt"
        } phương thức đặt phòng thành công`,
        data: methodToToggle,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT PHƯƠNG THỨC ĐẶT PHÒNG ===
  updateBookingMethod: async (req, res) => {
    try {
      const methodToUpdate = await BookingMethod.findById(req.params.id);
      if (!methodToUpdate) {
        return res
          .status(404)
          .json({ message: "Phương thức đặt phòng không tồn tại" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? methodToUpdate.toObject()
          : { ...methodToUpdate.toObject(), ...req.body };

      const validation = await bookingMethodController.validateBookingMethod(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await methodToUpdate.updateOne({ $set: updatedData });

      res.status(200).json({
        message: "Cập nhật phương thức đặt phòng thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA PHƯƠNG THỨC ĐẶT PHÒNG ===
  deleteBookingMethod: async (req, res) => {
    try {
      const methodToDelete = await BookingMethod.findById(req.params.id);
      if (!methodToDelete) {
        return res
          .status(404)
          .json({ message: "Phương thức đặt phòng không tồn tại" });
      }

      await methodToDelete.deleteOne();

      res.status(200).json({
        message: "Xóa phương thức đặt phòng thành công",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = bookingMethodController;
