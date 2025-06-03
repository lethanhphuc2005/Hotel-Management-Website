const mongoose = require("mongoose");

const AmenitySchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

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

RoomType_AmenitySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id; // Xóa _id trước khi trả về kết quả
    return ret;
  },
});

const AmenityModel = mongoose.model("amenity", AmenitySchema, "tiennghi");
const RoomType_AmenityModel = mongoose.model(
  "roomType_Amenity",
  RoomType_AmenitySchema,
  "loaiphong_tiennghi"
);

module.exports = {
  AmenityModel,
  RoomType_AmenityModel,
};
