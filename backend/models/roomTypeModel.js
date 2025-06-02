const mongoose = require("mongoose");

const RoomTypeSchema = new mongoose.Schema({
  TenLPCT: {
    type: String,
    required: true,
    maxlength: 100, // Giới hạn độ dài tên loại phòng
  },
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomTypeMain",
    required: true,
  },
  SoGiuong: {
    type: Number,
    required: true,
  },
  GiaPhong: {
    type: Number,
    required: true,
  },
  MoTa: {
    type: String,
    required: true,
    maxlength: 500, // Giới hạn độ dài mô tả loại phòng
  },
  View: {
    type: String,
    enum: ["sea", "mountain", "city", "garden", "pool"], // Giới hạn các giá trị hợp lệ cho View
    required: true,
  },
  TrangThai: {
    type: Boolean,
    default: false,
    required: true,
  },
});

RoomTypeSchema.virtual("LoaiPhong", {
  ref: "roomTypeMain", // Model loại phòng chính
  localField: "MaLP", // Trường MaLP trong RoomTypeSchema
  foreignField: "_id", // Trường _id trong RoomTypeMainSchema
});

RoomTypeSchema.virtual("TienNghi", {
  ref: "roomType_Amenity", // Model tiện nghi
  localField: "_id", // _id của roomtype
  foreignField: "MaLP", // Field trong Amenity tham chiếu đến roomtype
});

RoomTypeSchema.virtual("HinhAnh", {
  ref: "image", // Model hình ảnh
  localField: "_id", // _id của roomtype
  foreignField: "MaLP", // Field trong ImgRoomTypeSchema tham chiếu đến roomtype
});

RoomTypeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const RoomTypeModel = mongoose.model("roomType", RoomTypeSchema, "loaiphong");

module.exports = RoomTypeModel;
