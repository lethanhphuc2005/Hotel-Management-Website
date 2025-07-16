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
      const list = await Discount.find().sort({ createdAt: -1 });
      if (!list || list.length === 0) {
        return res.status(404).json({ message: "No discounts found" });
      }
      return res.status(200).json({
        message: "Discounts retrieved successfully",
        data: list,
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
