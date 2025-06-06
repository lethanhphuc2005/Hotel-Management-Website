const Service = require("../models/serviceModel");
const {
  upload,
  deleteImagesOnError,
  deleteOldImage,
} = require("../middleware/upload");

const serviceCon = {
  // === KIỂM TRA ĐIỀU KIỆN DỊCH VỤ ===
  validateService: async (serviceData, serviceId) => {
    const { name, price, description } = serviceData;

    if (!name || !description) {
      return {
        valid: false,
        message: "Thiếu thông tin dịch vụ",
      };
    }

    if (typeof name !== "string" || typeof description !== "string") {
      return {
        valid: false,
        message: "Tên dịch vụ và mô tả phải là chuỗi",
      };
    }

    if (price < 0) {
      return {
        valid: false,
        message: "Giá dịch vụ không được nhỏ hơn 0",
      };
    }

    if (name.length > 100 || description.length > 500) {
      return {
        valid: false,
        message: "Tên hoặc mô tả dịch vụ quá dài",
      };
    }

    // Kiểm tra tên dịch vụ có bị trùng không
    const existingService = await Service.findOne({ name });
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
        sort = "price",
        order = "desc",
        status,
      } = req.query;

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Lọc theo trạng thái nếu có
      if (typeof status !== "undefined") {
        // Chấp nhận cả true/false dạng string
        if (status === "true" || status === true) query.status = true;
        else if (status === "false" || status === false) query.status = false;
      }

      const sortOption = {};
      // Nếu sort là 'status', sắp xếp theo trạng thái
      if (sort === "status") {
        sortOption.status = order === "asc" ? 1 : -1;
      } else {
        sortOption[sort] = order === "asc" ? 1 : -1;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Service.countDocuments(query);
      const services = await Service.find(query)
        .sort(sortOption)
        .skip(skip)
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
        sort = "price",
        order = "desc",
      } = req.query;

      const query = { status: true }; // Chỉ lấy dịch vụ đang hoạt động
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      const sortObj = {};
      sortObj[sort] = order === "asc" ? 1 : -1;

      const skip = (parseInt(page) - 1) * parseInt(limit);
      const total = await Service.countDocuments(query);
      const services = await Service.find(query)
        .select("-status -createdAt -updatedAt")
        .sort(sortObj)
        .skip(skip)
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
      const service = await Service.findById(req.params.id);
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
  addService: [
    upload.single("image"),
    async (req, res) => {
      try {
        const newService = new Service(req.body);
        const validation = await serviceCon.validateService(newService);
        if (!validation.valid) {
          if (req.file) {
            deleteImagesOnError(req.file);
          }
          return res.status(400).json({ message: validation.message });
        }

        // Gắn ảnh nếu có
        if (req.file) {
          newService.image = `/images/${req.file.filename}`;
        }

        // Lưu dịch vụ mới
        await newService.save();

        res.status(201).json({
          message: "Thêm dịch vụ thành công",
          data: newService,
        });
      } catch (error) {
        if (req.file) {
          deleteImagesOnError(req.file);
        }
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // === CẬP NHẬT DỊCH VỤ ===
  updateService: [
    upload.single("image"),
    async (req, res) => {
      try {
        const serviceToUpdate = await Service.findById(req.params.id);
        if (!serviceToUpdate) {
          return res.status(404).json({ message: "Dịch vụ không tồn tại" });
        }

        const updatedData =
          Object.keys(req.body).length === 0
            ? serviceToUpdate.toObject()
            : { ...serviceToUpdate.toObject(), ...req.body };

        const validation = await serviceCon.validateService(
          updatedData,
          req.params.id,
          req.file
        );
        if (!validation.valid) {
          if (req.file) {
            deleteImagesOnError(req.file);
          }
          return res.status(400).json({ message: validation.message });
        }

        // Gắn ảnh mới nếu có
        if (req.file) {
          updatedData.image = `/images/${req.file.filename}`;
          // Xoá ảnh cũ nếu có
          if (serviceToUpdate.image) {
            deleteOldImage(serviceToUpdate.image);
          }
        } else {
          updatedData.image = serviceToUpdate.image;
        }

        const updatedService = await Service.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );
        res.status(200).json({
          message: "Cập nhật dịch vụ thành công",
          data: updatedService,
        });
      } catch (error) {
        if (req.file) {
          deleteImagesOnError(req.file);
        }
        res.status(500).json({ message: error.message });
      }
    },
  ],

  // === KÍCH HOẠT/ VÔ HIỆU HOÁ DỊCH VỤ ===
  toggleServiceStatus: async (req, res) => {
    try {
      const serviceToToggle = await Service.findById(req.params.id);
      if (!serviceToToggle) {
        return res.status(404).json({ message: "Dịch vụ không tồn tại" });
      }

      // Lưu trạng thái mới
      serviceToToggle.status = !serviceToToggle.status;
      await serviceToToggle.save();

      // Trả về dịch vụ đã được cập nhật
      const updatedService = await Service.findById(req.params.id);

      res.status(200).json({
        message: `Dịch vụ đã ${
          serviceToToggle.status ? "kích hoạt" : "vô hiệu hóa"
        } thành công`,
        data: updatedService,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // === XÓA DỊCH VỤ ===
  // deleteService: async (req, res) => {
  //   try {
  //     const serviceToDelete = await Service.findById(req.params.id);
  //     if (!serviceToDelete) {
  //       return res.status(404).json({ message: "Dịch vụ không tồn tại" });
  //     }

  //     // Kiểm tra xem dịch vụ có đang được sử dụng không
  //     if (serviceToDelete.status) {
  //       return res.status(400).json({
  //         message: "Không thể xóa dịch vụ đang hoạt động",
  //       });
  //     }

  //     await Service.findByIdAndDelete(req.params.id);
  //     res.status(200).json({
  //       message: "Xóa dịch vụ thành công",
  //       data: serviceToDelete,
  //     });
  //   } catch (error) {
  //     res.status(500).json({ message: error.message });
  //   }
  // },
};

module.exports = serviceCon;
