const mongoose = require("mongoose");

const PhongSchema = new mongoose.Schema({
  Tang: {
    type: Number,
    required: true,
  },
  TrangThai: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TrangThai", // Tên model bạn dùng để lưu trạng thái
    required: true,
  },
  MaLP: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "LoaiPhong", // Tên model bạn dùng để lưu loại phòng
    required: true,
  },
});
let phong = mongoose.model("phong", PhongSchema, "phong");
module.exports = { phong };
