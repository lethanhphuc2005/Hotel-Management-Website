const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
  {
    Tang: {
      type: String,
      required: true,
    },
    TenPhong: {
      type: String,
      required: true,
    },
    MaLP: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "roomType",
      required: true,
    },
    MaTT: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "status",
      required: true,
    },
  },
  { timestamps: true }
);
RoomSchema.virtual("LoaiPhong", {
  ref: "roomType",
  localField: "MaLP",
  foreignField: "_id",
  justOne: true,
});
RoomSchema.virtual("TrangThai", {
  ref: "status",
  localField: "MaTT",
  foreignField: "_id",
  justOne: true,
});

RoomSchema.set("toJSON", { virtuals: true, versionKey: false });

const RoomModel = mongoose.model("room", RoomSchema, "phong");
module.exports = RoomModel;
