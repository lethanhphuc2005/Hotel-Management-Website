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
});

MainRoomClassSchema.virtual("images", {
  ref: "image",
  localField: "_id",
  foreignField: "room_class_id",
  match: { target: "main_room_class" },
});

MainRoomClassSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const MainRoomClass = mongoose.model(
  "main_room_class",
  MainRoomClassSchema,
  "main_room_class"
);

module.exports = MainRoomClass;
