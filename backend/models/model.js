const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  TenPhong: {
    type: String,
    required: true,
  },
  Tang: {
    type: Number,
    required: true,
  },
  TrangThai: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "status", // Tên model bạn dùng để lưu trạng thái
    required: true,
  },
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomtype", // Tên model bạn dùng để lưu loại phòng
    required: true,
  },
});

const RoomTypeSchema = new mongoose.Schema({
  TenLP: {
    type: String,
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
});

RoomTypeSchema.virtual("TienNghi", {
  ref: "amenity", // Model tiện nghi
  localField: "_id", // _id của roomtype
  foreignField: "MaLP", // Field trong Amenity tham chiếu đến roomtype
});

RoomTypeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

RoomTypeSchema.set("toObject", {
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
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "roomtype", // Tham chiếu đến loại phòng
    required: true,
  },
});

const ImgRoomTypeSchema = new mongoose.Schema({
    MaLP: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "roomtype",
    },
    HinhAnh: {
        type: String,
        required: true,
    },
});

RoomTypeSchema.virtual("HinhAnh", {
  ref: "imgroomtype",
  localField: "_id", // _id của roomtype
  foreignField: "MaLP", // Field trong imgroomtype tham chiếu đến roomtype
});

RoomTypeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

RoomTypeSchema.set("toObject", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

let room = mongoose.model("room", RoomSchema, "phong");
let roomtype = mongoose.model("roomtype", RoomTypeSchema, "loaiphong");
let amenity = mongoose.model("amenity", AmenitySchema, "tiennghi");
let imgroomtype = mongoose.model("imgroomtype", ImgRoomTypeSchema, "hinhanh");

module.exports = { room, roomtype, amenity, imgroomtype };