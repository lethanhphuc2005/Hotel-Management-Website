const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      default: "",
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 500,
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: ["Percentage", "Fixed Amount", "Service Discount"],
      default: "Percentage",
    },
    value: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (v) {
          return this.type === "Percentage" ? v <= 100 : v >= 0; // Giá trị phải <= 100 nếu là phần trăm, >= 0 nếu là số tiền cố định
        },
        message: "Giá trị không hợp lệ cho loại khuyến mãi này!",
      },
      default: 0,
    },
    start_day: {
      type: Date,
      required: true,
      default: Date.now,
      validate: {
        validator: function (v) {
          return v <= this.end_day; // Ngày bắt đầu phải trước hoặc bằng ngày kết thúc
        },
        message: "Ngày bắt đầu phải trước hoặc bằng ngày kết thúc!",
      },
    },
    end_day: {
      type: Date,
      required: true,
      default: Date.now() + 30 * 24 * 60 * 60 * 1000, // Mặc định là 30 ngày sau ngày bắt đầu
      validate: {
        validator: function (v) {
          return v > this.start_day; // Ngày kết thúc phải sau ngày bắt đầu
        },
        message: "Ngày kết thúc phải sau ngày bắt đầu!",
      },
    },
    limit: {
      type: String,
      required: true,
      trim: true,
      enum: ["unlimited", "limited"],
      default: "unlimited",
    },
    quantity: {
      type: Number,
      required: function () {
        return this.limit === "limited"; // Chỉ yêu cầu khi loại là "Limited"
      },
      min: 1,
      validate: {
        validator: function (v) {
          return this.limit === "unlimited" || v > 0; // Giá trị phải > 0 nếu là "Limited"
        },
        message: "Số lượng giới hạn phải lớn hơn 0!",
      },
    },
    status: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

DiscountSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const Discount = mongoose.model("discount", DiscountSchema, "discount");
module.exports = Discount;
