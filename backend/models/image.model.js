const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
      default: "",
      trim: true,
    },
    target: {
      type: String,
      enum: ["main_room_class", "room_class", "service", "feature", "content", "discount"],
      required: true,
      default: "",
      trim: true,
    },
    target_id: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "target",
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

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
