const mongoose = require("mongoose");

const contentTypeSchema = new mongoose.Schema(
  {
    TenND: {
      type: String,
      required: true,
      maxlength: 100,
    },
    MoTa: {
      type: String,
      required: true,
      maxlength: 255,
    },
    TrangThai: {
      type: Boolean,
      default: false, // Mặc định là true
    },
  },
  { timestamps: true }
);

contentTypeSchema.virtual("DanhSachNoiDungWebsite", {
  ref: "websiteContent",
  localField: "_id",
  foreignField: "MaND", //
});

// Tùy chọn để virtuals hiển thị khi toJSON hoặc toObject
contentTypeSchema.set("toJSON", { virtuals: true, versionKey: false });

const contentTypeModel = mongoose.model(
  "contentType",
  contentTypeSchema,
  "loai_noidung"
);

module.exports = contentTypeModel;
