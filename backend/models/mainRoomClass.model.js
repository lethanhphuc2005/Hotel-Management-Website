const mongoose = require("mongoose");

const MainRoomClassSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: 100,
      required: true,
      default: "",
      trim: true,
    },
    description: {
      type: String,
      maxlength: 500,
      default: "",
      trim: true,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

MainRoomClassSchema.virtual("room_class_list", {
  ref: "room_class",
  localField: "_id",
  foreignField: "main_room_class_id",
  justOne: false,
  options: {
    select: "name description status createdAt updatedAt",
  },
});

MainRoomClassSchema.virtual("images", {
  ref: "image",
  localField: "_id",
  foreignField: "room_class_id",
  match: [
    { status: true }, // Chỉ lấy ảnh hợp lệ
    { type: "main_room_class" }, // Chỉ lấy ảnh loại phòng chính
  ],
  justOne: false,
  options: {
    select: "url target status createdAt updatedAt",
  },
});

MainRoomClassSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const MainRoomClass = mongoose.model(
  "main_room_class",
  MainRoomClassSchema,
  "main_room_class"
);

module.exports = MainRoomClass;
