const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking",
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

ReviewSchema.virtual("booking", {
  ref: "booking",
  localField: "booking_id",
  foreignField: "_id",
});

ReviewSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
});

ReviewSchema.virtual("employee", {
  ref: "employee",
  localField: "employee_id",
  foreignField: "_id",
});

ReviewSchema.virtual("parent_review", {
  ref: "review",
  localField: "parent_id",
  foreignField: "_id",
});

ReviewSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret._id;
    return ret;
  },
});
const Review = mongoose.model("review", ReviewSchema, "review");

module.exports = Review;
