const mongoose = require("mongoose");

const websiteContentSchema = new mongoose.Schema(
  {
    TieuDe: {
      type: String,
      required: true,
      maxlength: 100,
    },
    NoiDung: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    MaND: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "contentType",
      required: true,
    },
    NgayDang: {
      type: Date,
      default: Date.now,
    },
    HinhAnh: {
      type: String,
      required: true,
      maxlength: 255,
    },
    TrangThai: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Thiết lập virtual populate nếu muốn lấy thông tin loại nội dung kèm theo nội dung
websiteContentSchema.virtual("LoaiNoiDung", {
  ref: "contentType",
  localField: "MaND",
  foreignField: "_id",
  justOne: true,
});

// Bật options để trả về virtuals khi toJSON hoặc toObject
websiteContentSchema.set("toJSON", { virtuals: true, versionKey: false });

const websiteContentModel = mongoose.model(
  "websiteContent",
  websiteContentSchema,
  "noidung_website"
);

module.exports = websiteContentModel;
