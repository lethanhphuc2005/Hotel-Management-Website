const Discount = require("../models/discount.model");
const calculateBookingPrice =
  require("../services/discount.service").calculateBookingPrice;

const DiscountController = {
  validateDiscount: async (discountData, discountId) => {
    const { type, value, valueType, promoCode } = discountData;
    if (!type || !value || !valueType) {
      return {
        valid: false,
        message: "Type, value, and valueType are required",
      };
    }
    if (type === "promo_code" && !promoCode) {
      return {
        valid: false,
        message: "Promo code is required for promo_code type",
      };
    }
    if (valueType !== "percent" && valueType !== "fixed") {
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
        promoCode,
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
  createDiscount: async (req, res) => {
    try {
      const discount = new Discount(req.body);
      const validate = await DiscountController.validateDiscount(
        discount,
        null
      );
      if (!validate.valid) {
        return res.status(400).json({ message: validate.message });
      }

      await discount.save();

      return res.status(201).json({
        message: "Discount created successfully",
        data: discount,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

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
        validFrom: { $lte: now },
        validTo: { $gte: now },
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

  updateDiscount: async (req, res) => {
    try {
      const updated = await Discount.findById(req.params.id);
      if (!updated) {
        return res.status(404).json({ message: "Discount not found" });
      }
      const validate = await DiscountController.validateDiscount(
        req.body,
        req.params.id
      );
      if (!validate.valid) {
        return res.status(400).json({ message: validate.message });
      }

      const updatedData =
        Object.keys(req.body).length === 0
          ? featureToUpdate.toObject()
          : { ...featureToUpdate.toObject(), ...req.body };

      await updated.updateOne({ $set: updatedData });

      return res.status(200).json({
        message: "Discount updated successfully",
        data: updatedData,
      });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

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
      const user = req.user;
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
