const mongoose = require("mongoose");

const userFavoriteSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "room_class",
    },
  },
  { timestamps: true }
);

userFavoriteSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
  justOne: true, // Chỉ lấy một đối tượng
  options: {
    select: "name email phone createdAt updatedAt", // Chọn các trường cần thiết
  },
});

userFavoriteSchema.virtual("room_class", {
  ref: "room_class",
  localField: "room_class_id",
  foreignField: "_id",
  justOne: true, // Chỉ lấy một đối tượng
  options: {
    select: "name description price status view main_room_class_id", // Chọn các trường cần thiết
  },
});

userFavoriteSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
     ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const UserFavorite = mongoose.model(
  "user_favorite",
  userFavoriteSchema,
  "user_favorite"
);

module.exports = UserFavorite;
