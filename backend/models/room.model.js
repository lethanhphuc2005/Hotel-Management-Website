const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    floor: {
      type: Number,
      default: 1,
      trim: true,
      min: 1,
    },
    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room_class",
      required: true,
    },
    room_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room_status",
      default: null,
    },
  },
  { timestamps: true }
);

RoomSchema.virtual("room_class", {
  ref: "room_class",
  localField: "room_class_id",
  foreignField: "_id",
});

RoomSchema.virtual("status", {
  ref: "room_status",
  localField: "room_status_id",
  foreignField: "_id",
});

RoomSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

const Room = mongoose.model("room", RoomSchema, "room");
module.exports = Room;
