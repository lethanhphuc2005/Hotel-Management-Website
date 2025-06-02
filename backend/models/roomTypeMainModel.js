const mongoose = require("mongoose");

const RoomTypeMainSchema = new mongoose.Schema({
  TenLP: {
    type: String,
    required: true,
    maxlength: 100, // Giới hạn độ dài tên loại phòng
  },
  MoTa: {
    type: String,
    required: true,
    maxlength: 500, // Giới hạn độ dài mô tả loại phòng
  },
  TrangThai: {
    type: Boolean,
    default: false,
    required: true,
  },
});

RoomTypeMainSchema.virtual("DanhSachLoaiPhong", {
  ref: "roomType",
  localField: "_id",
  foreignField: "MaLP",
});

RoomTypeMainSchema.virtual("HinhAnh", {
  ref: "image",
  localField: "_id",
  foreignField: "MaLP",
});

RoomTypeMainSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const RoomTypeMainModel = mongoose.model(
  "roomTypeMain",
  RoomTypeMainSchema,
  "loaiphong_chinh"
);

module.exports = RoomTypeMainModel;
