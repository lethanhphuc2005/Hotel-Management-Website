const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
      required: true,
    },

    room_class_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room_class",
      required: true,
    },

    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
      default: null,
    },

    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },

    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      default: null,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: null,
      min: 1,
      max: 5,
    },

    status: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  { timestamps: true }
);

ReviewSchema.virtual("room_class", {
  ref: "room_class",
  localField: "room_class_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name description status",
  },
});

ReviewSchema.virtual("booking", {
  ref: "booking",
  localField: "booking_id",
  foreignField: "_id",
  justOne: true,
});

ReviewSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

ReviewSchema.virtual("employee", {
  ref: "employee",
  localField: "employee_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

ReviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
      ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});
const Review = mongoose.model("review", ReviewSchema, "review");

module.exports = Review;
