const mongoose = require("mongoose");

const BookingMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    status: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

BookingMethodSchema.virtual("bookings", {
  ref: "booking",
  localField: "_id",
  foreignField: "booking_method_id",
  justOne: false,
});

BookingMethodSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const BookingMethod = mongoose.model(
  "booking_method",
  BookingMethodSchema,
  "booking_method"
);

module.exports = BookingMethod;
