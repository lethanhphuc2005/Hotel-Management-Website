const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "room_class",
      required: true,
    },
    url: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    target: {
      type: String,
      enum: ["main_room_class", "room_class"],
      required: true,
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

ImageSchema.virtual("room_class", {
  ref: (doc) => doc.target,
  localField: "room_class_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name description status",
  },
});

ImageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Image = mongoose.model("image", ImageSchema, "image");

module.exports = Image;
