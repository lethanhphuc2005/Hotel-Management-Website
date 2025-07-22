const PaymentMethod = require("../models/paymentMethod.model");

const paymentMethodController = {
  // === KIỂM TRA ĐIỀU KIỆN PHƯƠNG THỨC THANH TOÁN ===
  validatePaymentMethod: async (paymentMethodData, paymentMethodId) => {
    const { name, status } = paymentMethodData;
    if (!name) {
      return {
        valid: false,
        message: "Tên phương thức thanh toán không được để trống",
      };
    }
    if (typeof name !== "string") {
      return {
        valid: false,
        message: "Tên phương thức thanh toán phải là chuỗi",
      };
    }
    if (typeof status !== "boolean") {
      return {
        valid: false,
        message: "Trạng thái phải là true hoặc false",
      };
    }

    const existingMethod = await PaymentMethod.findOne({ name });
    if (
      existingMethod &&
      (!paymentMethodId ||
        existingMethod._id.toString() !== paymentMethodId.toString())
    ) {
      return { valid: false, message: "Tên phương thức thanh toán đã tồn tại" };
    }

    return { valid: true };
  },

  // === LẤY TẤT CẢ PHƯƠNG THỨC THANH TOÁN ===
  getAllPaymentMethods: async (req, res) => {
    try {
      const {
        search,
        page = 1,
        limit,
        sort = "createdAt",
        order = "asc",
        status,
      } = req.query;

      const query = {};
      if (search) {
        query.name = { $regex: search, $options: "i" };
      }

      if (status) {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) {
          query.status = true;
        } else if (status === "false" || status === false) {
          query.status = false;
        }
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const totalMethods = await PaymentMethod.countDocuments(query);
      const paymentMethods = await PaymentMethod.find(query)
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit))
        .populate("payments");

      if (!paymentMethods || paymentMethods.length === 0) {
        return res
          .status(404)
          .json({ message: "Không tìm thấy phương thức thanh toán nào" });
      }

      res.status(200).json({
        message: "Lấy danh sách phương thức thanh toán thành công",
        data: paymentMethods,
        pagination: {
          total: totalMethods,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(totalMethods / parseInt(limit)),
        },
      });

      res.status(200).json(paymentMethods);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === LẤY PHƯƠNG THỨC THANH TOÁN THEO ID ===
  getPaymentMethodById: async (req, res) => {
    try {
      const paymentMethod = await PaymentMethod.findById(
        req.params.id
      ).populate("payments");
      if (!paymentMethod) {
        return res
          .status(404)
          .json({ message: "Phương thức thanh toán không tồn tại" });
      }
      res.status(200).json({
        message: "Lấy phương thức thanh toán thành công",
        data: paymentMethod,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === THÊM PHƯƠNG THỨC THANH TOÁN ===
  addPaymentMethod: async (req, res) => {
    try {
      const newPaymentMethod = new PaymentMethod(req.body);

      const validation = await paymentMethodController.validatePaymentMethod(
        newPaymentMethod
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await newPaymentMethod.save();
      res.status(201).json({
        message: "Thêm phương thức thanh toán thành công",
        data: newPaymentMethod,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === CẬP NHẬT PHƯƠNG THỨC THANH TOÁN ===
  updatePaymentMethod: async (req, res) => {
    try {
      const paymentMethodToUpdate = await PaymentMethod.findById(req.params.id);
      if (!paymentMethodToUpdate) {
        return res
          .status(404)
          .json({ message: "Phương thức thanh toán không tồn tại" });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? paymentMethodToUpdate.toObject()
          : { ...paymentMethodToUpdate.toObject(), ...req.body };

      const validation = await paymentMethodController.validatePaymentMethod(
        updatedData,
        req.params.id
      );
      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await paymentMethodToUpdate.updateOne({ $set: updatedData });

      res.status(200).json({
        message: "Cập nhật phương thức thanh toán thành công",
        data: updatedData,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // === XÓA PHƯƠNG THỨC THANH TOÁN ===
  deletePaymentMethod: async (req, res) => {
    try {
      const paymentMethodToDelete = await PaymentMethod.findById(req.params.id);
      if (!paymentMethodToDelete) {
        return res
          .status(404)
          .json({ message: "Phương thức thanh toán không tồn tại" });
      }

      // Kiểm tra xem phương thức có đang được sử dụng trong booking hay không
      const bookings = await paymentMethodToDelete.bookings;
      if (bookings && bookings.length > 0) {
        return res.status(400).json({
          message: "Không thể xóa phương thức đang được sử dụng trong booking.",
        });
      } else if (paymentMethodToDelete.status === true) {
        return res.status(400).json({
          message: "Không thể xóa phương thức đang hoạt động.",
        });
      }

      await paymentMethodToDelete.deleteOne();

      res.status(200).json({
        message: "Xóa phương thức thanh toán thành công",
        data: paymentMethodToDelete,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = paymentMethodController;
