const Discount = require("../models/discount.model");
const User = require("../models/user.model");
const calculateBookingPrice =
  require("../services/discount.service").calculateBookingPrice;
const {
  upload,
  deleteImagesOnError,
  deleteOldImages,
} = require("../middlewares/upload.middleware");

const DiscountController = {
  validateDiscount: async (discountData, discountId) => {
    const { type, value, value_type, promo_code } = discountData;
    if (!type || !value || !value_type) {
      return {
        valid: false,
        message: "Type, value, and value_type are required",
      };
    }
    if (type === "promo_code" && !promo_code) {
      return {
        valid: false,
        message: "Promo code is required for promo_code type",
      };
    }
    if (value_type !== "percent" && value_type !== "fixed") {
      return {
        valid: false,
        message: "Value type must be either 'percent' or 'fixed'",
      };
    }
    if (value <= 0) {
      return {
        valid: false,
        message: "Value must be greater than 0",
      };
    }

    if (discountId) {
      const existingDiscount = await Discount.findOne({
        promo_code,
        _id: { $ne: discountId },
      });
      if (existingDiscount) {
        return {
          valid: false,
          message: "Promo code already exists",
        };
      }
    }
    return {
      valid: true,
    };
  },
  createDiscount: [
    upload.single("image"),
    async (req, res) => {
      try {
        const discount = new Discount(req.body);
        const validate = await DiscountController.validateDiscount(
          discount,
          null
        );
        if (!validate.valid) {
          if (req.file) {
            deleteImagesOnError(req.file);
          }
          return res.status(400).json({ message: validate.message });
        }

        if (req.file) {
          discount.image = req.file.filename;
        }

        await discount.save();

        return res.status(201).json({
          message: "Discount created successfully",
          data: discount,
        });
      } catch (err) {
        if (req.file) {
          deleteImagesOnError(req.file);
        }
        return res.status(500).json({ message: err.message });
      }
    },
  ],

  getAllDiscounts: async (req, res) => {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        sort = "createdAt",
        order = "desc",
        type,
        status,
        value_type,
        valid_from,
        valid_to,
        priority,
        apply_to, // lọc theo room_class_ids
        min_advance_days,
        max_advance_days,
        min_stay_nights,
        max_stay_nights,
        min_rooms,
        user_level, // lọc theo user level
      } = req.query;

      const query = {};

      // Tìm kiếm theo text
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { promo_code: { $regex: search, $options: "i" } },
        ];
      }

      // Các điều kiện lọc trực tiếp
      if (type) query.type = type;
      if (value_type) query.value_type = value_type;
      if (priority) query.priority = Number(priority);

      // valid_from / valid_to
      if (valid_from) query.valid_from = { $gte: new Date(valid_from) };
      if (valid_to)
        query.valid_to = { ...query.valid_to, $lte: new Date(valid_to) };

      // Trạng thái (chuyển về boolean)
      if (typeof status !== "undefined") {
        query.status = status === "true" || status === true;
      }

      // Lọc theo mảng apply_to_room_class_ids
      if (apply_to) {
        query.apply_to_room_class_ids = {
          $in: Array.isArray(apply_to) ? apply_to : apply_to.split(","),
        };
      }

      // Lọc theo điều kiện con trong 'conditions'
      if (min_advance_days)
        query["conditions.min_advance_days"] = {
          $gte: Number(min_advance_days),
        };
      if (max_advance_days)
        query["conditions.max_advance_days"] = {
          $lte: Number(max_advance_days),
        };
      if (min_stay_nights)
        query["conditions.min_stay_nights"] = { $gte: Number(min_stay_nights) };
      if (max_stay_nights)
        query["conditions.max_stay_nights"] = { $lte: Number(max_stay_nights) };
      if (min_rooms)
        query["conditions.min_rooms"] = { $gte: Number(min_rooms) };

      // Lọc user level nếu có
      if (user_level) {
        query["conditions.user_levels"] = {
          $in: Array.isArray(user_level) ? user_level : user_level.split(","),
        };
      }

      // Sắp xếp
      const sortOption = {};
      sortOption[sort] = order === "asc" ? 1 : -1;

      // Phân trang
      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [discounts, total] = await Promise.all([
        Discount.find(query).sort(sortOption).skip(skip).limit(parseInt(limit)),
        Discount.countDocuments(query),
      ]);

      if (!discounts || discounts.length === 0) {
        return res
          .status(404)
          .json({ message: "Không có mã giảm giá nào được tìm thấy." });
      }

      res.status(200).json({
        message: "Lấy tất cả mã giảm giá thành công",
        data: discounts,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getAllDiscountsForUser: async (req, res) => {
    try {
      const now = new Date();
      const list = await Discount.find({
        status: true,
        valid_from: { $lte: now },
        valid_to: { $gte: now },
      }).sort({ createdAt: -1 });
      if (!list || list.length === 0) {
        return res.status(404).json({ message: "No discounts found" });
      }
      return res.status(200).json({
        message: "Discounts retrieved successfully",
        data: list,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  getDiscountById: async (req, res) => {
    try {
      const discount = await Discount.findById(req.params.id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      return res.status(200).json({
        message: "Discount retrieved successfully",
        data: discount,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  updateDiscount: [
    upload.single("image"),
    async (req, res) => {
      try {
        const updated = await Discount.findById(req.params.id);
        if (!updated) {
          return res.status(404).json({ message: "Discount not found" });
        }
        const validate = await DiscountController.validateDiscount(
          req.body,
          req.params.id
        );

        const updatedData =
          Object.keys(req.body).length === 0
            ? featureToUpdate.toObject()
            : { ...featureToUpdate.toObject(), ...req.body };

        if (!validate.valid) {
          if (req.file) {
            deleteImagesOnError(req.file);
          }
          return res.status(400).json({ message: validate.message });
        }

        if (req.file) {
          updatedData.image = req.file.filename;
          if (updated.image) {
            deleteOldImages(updated.image);
          }
        } else {
          updatedData.image = updated.image;
        }

        const updatedDiscount = await Discount.findByIdAndUpdate(
          req.params.id,
          updatedData,
          { new: true }
        );

        return res.status(200).json({
          message: "Discount updated successfully",
          data: updatedDiscount,
        });
      } catch (err) {
        return res.status(500).json({ message: err.message });
      }
    },
  ],

  toggleDiscountStatus: async (req, res) => {
    try {
      const discount = await Discount.findById(req.params.id);
      if (!discount) {
        return res.status(404).json({ message: "Discount not found" });
      }
      discount.status = !discount.status;
      await discount.save();
      return res.status(200).json({
        message: `Discount ${
          discount.status ? "activated" : "deactivated"
        } successfully`,
        data: discount,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  // deleteDiscount: async (req, res) => {
  //   try {
  //     await Discount.findByIdAndDelete(req.params.id);
  //     res.json({ success: true });
  //   } catch (err) {
  //     res.status(500).json({ message: err.message });
  //   }
  // },

  previewBookingPrice: async (req, res) => {
    try {
      const { bookingInfo } = req.body;
      const user = await User.findById(req.user.id);

      const result = await calculateBookingPrice(bookingInfo, user);
      return res.status(200).json({
        message: "Discounts previewed successfully",
        data: result,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },
};

module.exports = DiscountController;
