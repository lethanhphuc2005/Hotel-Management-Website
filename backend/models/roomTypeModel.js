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

const RoomTypeSchema = new mongoose.Schema({
  TenLPCT: {
    type: String,
    required: true,
  },
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomTypeMain", // Tên model bạn dùng để lưu loại phòng chính
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
  },
  View: {
    type: String,
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
  ref: "amenity", // Model tiện nghi
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

const ImgRoomTypeSchema = new mongoose.Schema({
  HinhAnh: {
    type: String,
    required: true,
  },
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomtype", // Tên model bạn dùng để lưu loại phòng
    required: true,
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
});

ImgRoomTypeSchema.virtual("LoaiPhong", {
  ref: (doc) => doc.Loai, // ref động
  localField: "MaLP",
  foreignField: "_id",
  justOne: true,
});

ImgRoomTypeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const AmenitySchema = new mongoose.Schema({
  TenTN: {
    type: String,
    required: true,
  },
  MoTa: {
    type: String,
    required: true,
  },
  HinhAnh: {
    type: String,
    required: true,
  },
  TrangThai: {
    type: Boolean,
    default: false,
    required: true,
  },
});

AmenitySchema.virtual("LoaiPhongSuDung", {
  ref: "roomType_Amenity", // Model loại phòng
  localField: "_id", // _id của tiện nghi
  foreignField: "MaTN", // Field trong RoomTypeSchema tham chiếu đến tiện nghi
});

AmenitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const RoomType_AmenitySchema = new mongoose.Schema({
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomType", // Tham chiếu đến loại phòng
    required: true,
  },
  MaTN: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "amenity", // Tham chiếu đến tiện nghi
    required: true,
  },
});

const RoomTypeMainModel = mongoose.model(
  "roomTypeMain",
  RoomTypeMainSchema,
  "loaiphong_chinh"
);
const RoomTypeModel = mongoose.model("roomType", RoomTypeSchema, "loaiphong");
const ImgRoomTypeModel = mongoose.model("image", ImgRoomTypeSchema, "hinhanh");
const AmenityModel = mongoose.model("amenity", AmenitySchema, "tiennghi");
const RoomType_AmenityModel = mongoose.model(
  "roomType_Amenity",
  RoomType_AmenitySchema,
  "loaiphong_tiennghi"
);

module.exports = {
  RoomTypeMainModel,
  RoomTypeModel,
  ImgRoomTypeModel,
  AmenityModel,
  RoomType_AmenityModel,
};
