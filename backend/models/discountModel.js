const mongoose = require("mongoose");

const DiscountSchema = new mongoose.Schema({
  TenKM: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 100,
  },
  MoTa: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 500,
  },
  LoaiKM: {
    type: String,
    required: true,
    enum: ["Percentage", "Fixed Amount", "Service Discount"],
    default: "Percentage",
  },
  GiaTriKM: {
    type: Number,
    required: true,
    min: 0,
  },
  NgayBD: {
    type: Date,
    required: true,
    default: Date.now,
  },
  NgayKT: {
    type: Date,
    required: true,
    validate: {
      validator: function (v) {
        return v > this.NgayBD; // Ngày kết thúc phải sau ngày bắt đầu
      },
      message: "Ngày kết thúc phải sau ngày bắt đầu!",
    },
    default: Date.now() + 30 * 24 * 60 * 60 * 1000, // Mặc định là 30 ngày sau ngày bắt đầu
  },
  TrangThai: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const discountModel = mongoose.model("discount", DiscountSchema, "khuyenmai");
module.exports = discountModel;
