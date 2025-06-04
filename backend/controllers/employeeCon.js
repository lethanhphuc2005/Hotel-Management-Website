const Employee = require("../models/employeeModel");
const bcrypt = require("bcryptjs");

const employeeCon = {
  // === KIỂM TRA CÁC ĐIỀU KIỆN NHÂN VIÊN ===
  validateEmployee: async (employeeData, employeeId) => {
    const {
      email,
      password,
      first_name,
      last_name,
      phone_number,
      address,
      position,
      department,
    } = employeeData;

    // Kiểm tra các trường bắt buộc
    if (
      !email ||
      !password ||
      !first_name ||
      !last_name ||
      !phone_number ||
      !address ||
      !position ||
      !department
    ) {
      return {
        valid: false,
        message: "Vui lòng điền đầy đủ thông tin nhân viên.",
      };
    }

    // Kiểm tra định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: "Email không hợp lệ." };
    }

    // Kiểm tra độ dài chuỗi
    if (
      first_name.length > 100 ||
      last_name.length > 100 ||
      address.length > 255 ||
      position.length > 100 ||
      department.length > 100
    ) {
      return { valid: false, message: "Thông tin quá dài." };
    }

    // Kiểm tra trùng email
    const existing = await Employee.findOne({ email });
    if (
      existing &&
      (!employeeId || existing._id.toString() !== employeeId.toString())
    ) {
      return {
        valid: false,
        message: employeeId
          ? "Email này đã được sử dụng bởi nhân viên khác."
          : "Email đã tồn tại.",
      };
    }

    // Kiểm tra số điện thoại
    const phoneRegex = /^\d{10,11}$/; // Chấp nhận số điện thoại 10 hoặc 11 chữ số
    if (!phoneRegex.test(phone_number)) {
      return { valid: false, message: "Số điện thoại không hợp lệ." };
    }

    return { valid: true, message: "Thông tin hợp lệ." };
  },

  // ====== LẤY TẤT CẢ NHÂN VIÊN (TÌM KIẾM, SẮP XẾP, PHÂN TRANG, LỌC THEO VỊ TRÍ, PHÒNG BAN, VAI TRÒ) =====
  getAllEmployees: async (req, res) => {
    try {
      const {
        search,
        sort = "createdAt",
        order = "desc",
        limit = 10,
        page = 1,
        role,
        status,
      } = req.query;

      const query = {};

      // Search by name or email
      if (search) {
        query.$or = [
          { first_name: { $regex: search, $options: "i" } },
          { last_name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone_number: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { position: { $regex: search, $options: "i" } },
          { department: { $regex: search, $options: "i" } },
        ];
      }

      // Filter by role
      if (role) {
        query.role = role;
      }

      // Filter by status
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

      // Pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const users = await Employee.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .exec();

      const total = await Employee.countDocuments(query);

      res.status(200).json({
        message: "Lấy tất cả nhân viên thành công",
        data: users,
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

  // ====== LẤY NHÂN VIÊN THEO ID =====
  getEmployeeById: async (req, res) => {
    try {
      const checkUser = await Employee.findById(req.params.id);
      if (!checkUser) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }

      res.status(200).json({
        message: "Lấy thông tin nhân viên thành công",
        data: checkUser,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  // ====== ĐỔI MẬT KHẨU NHÂN VIÊN =====
  changePassword: async (req, res) => {
    try {
      const { password, newPassword } = req.body;

      if (!password || !newPassword) {
        return res
          .status(400)
          .json({ message: "Mật khẩu không được để trống" });
      }
      const checkUser = await Employee.findById(req.params.id);

      if (!checkUser) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }

      const isMatch = await bcrypt.compare(password, checkUser.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Mật khẩu hiện tại không đúng" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await checkUser.updateOne({ $set: { password: hashedPassword } });

      res.status(200).json("Đổi mật khẩu thành công!");
    } catch (err) {
      res
        .status(500)
        .json({ message: "Đổi mật khẩu không thành công", error: err });
    }
  },

  // ====== CẬP NHẬT THÔNG TIN NHÂN VIÊN =====
  updateEmployee: async (req, res) => {
    try {
      const userToUpdate = await Employee.findById(req.params.id);
      if (!userToUpdate) {
        return res.status(404).json({ message: "Không tìm thấy nhân viên" });
      }

      // Validate employer data
      const updatedData =
        Object.keys(req.body).length === 0
          ? userToUpdate.toObject()
          : { ...userToUpdate.toObject(), ...req.body };

      const validation = await employeeCon.validateEmployee(
        updatedData,
        req.params.id
      );

      if (!validation.valid) {
        return res.status(400).json({ message: validation.message });
      }

      await userToUpdate.updateOne({ $set: req.body });
      res.status(200).json({
        message: "Cập nhật thông tin nhân viên thành công",
        data: { ...userToUpdate._doc, ...req.body },
      });
    } catch (error) {
      res.status(500).json(error);
    }
  },

  //   // ====== XOÁ NHÂN VIÊN =====
  // deleteEmployer: async (req, res) => {
  //   try {
  //     const checkUser = await Employee.findByIdAndDelete(req.params.id);
  //     if (!checkUser) {
  //       return res.status(404).json({ message: "Không tìm thấy nhân viên" });
  //     }
  //     res.status(200).json("Xóa thành công !!!");
  //   } catch (error) {
  //     res.status(500).json(error);
  //   }
  // },
};

module.exports = employeeCon;
