const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    TenDV: {
      type: String,
      required: true,
      maxlength: 100,
    },
    GiaDV: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    MoTa: {
      type: String,
      required: true,
      maxlength: 500,
      default: "",
    },
    HinhAnh: {
      type: String,
      required: true,
      maxlength: 255,
      default: "",
    },
    TrangThai: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

ServiceSchema.set("toJSON", { versionKey: false });
ServiceSchema.set("toObject", { versionKey: false });

const ServiceModel = mongoose.model("service", ServiceSchema, "dichvu");

module.exports = ServiceModel;
