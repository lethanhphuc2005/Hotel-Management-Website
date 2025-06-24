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
    image: {
      type: String,
      maxlength: 255,
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

ServiceSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});

const Service = mongoose.model("service", ServiceSchema, "service");

module.exports = Service;
