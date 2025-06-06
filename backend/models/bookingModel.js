const { request } = require("express");
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    booking_date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    check_in_date: {
      type: Date,
      required: true,
    },
    check_out_date: {
      type: Date,
      required: true,
    },
    adult_amount: {
      type: Number,
      required: true,
      min: 1,
    },
    child_amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    booking_status_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking_status",
      required: true,
    },
    booking_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "booking_method",
      required: true,
    },
    request: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount_value: {
      type: Number,
      default: 0,
      min: 0,
    },
    discount_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "discount",
      default: null,
    },
    payment_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment_method",
      required: true,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      default: null,
    },
    extra_fee: {
      type: Number,
      default: 0,
      min: 0,
    },
    note: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    cancel_reason: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    cancel_date: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

bookingSchema.virtual("booking_status", {
  ref: "booking_status",
  localField: "booking_status_id",
  foreignField: "_id",
});

bookingSchema.virtual("booking_method", {
  ref: "booking_method",
  localField: "booking_method_id",
  foreignField: "_id",
});

bookingSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
});

bookingSchema.virtual("discount", {
  ref: "discount",
  localField: "discount_id",
  foreignField: "_id",
});

bookingSchema.virtual("payment_method", {
  ref: "payment_method",
  localField: "payment_method_id",
  foreignField: "_id",
});

bookingSchema.virtual("employee", {
  ref: "employee",
  localField: "employee_id",
  foreignField: "_id",
});

bookingSchema.virtual("booking_details", {
  ref: "booking_detail",
  localField: "_id",
  foreignField: "booking_id",
});

bookingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const Booking = mongoose.model("booking", bookingSchema, "booking");
module.exports = Booking;
