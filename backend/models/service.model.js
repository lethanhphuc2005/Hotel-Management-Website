const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
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

ServiceSchema.virtual("image", {
  ref: "image",
  localField: "_id",
  foreignField: "target_id",
  match: { target: "service", status: true }, // Only get images with valid status
  justOne: true,
  options: {
    select: "url public_id",
  },
});

ServiceSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Service = mongoose.model("service", ServiceSchema, "service");

module.exports = Service;
