const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    HinhAnh: {
      type: String,
      required: true,
    },
    MaLP: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "Loai", // Tên model bạn dùng để lưu loại phòng
    },
    Loai: {
      type: String,
      enum: ["roomTypeMain", "roomType"], // Chỉ cho phép các giá trị này
      required: true,
    },
    TrangThai: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

ImageSchema.virtual("LoaiPhong", {
  ref: (doc) => doc.Loai, // ref động
  localField: "MaLP",
  foreignField: "_id",
  justOne: true,
});

ImageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const ImageModel = mongoose.model("image", ImageSchema, "hinhanh");

module.exports = ImageModel;
