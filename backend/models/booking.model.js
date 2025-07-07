const { request } = require("express");
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      validate: {
        validator: function (v) {
          return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    phone_number: {
      type: String,
      required: true,
      trim: true,
      maxlength: 15,
      minlength: 10,
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
    discount_value: {
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
    original_price: {
      type: Number,
      required: true,
      min: 0,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    payment_status: {
      type: String,
      enum: ["PAID", "UNPAID", "CANCELED"],
      default: "UNPAID",
      required: true,
    },
    discount_id: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "discount",
      },
    ],
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employee",
      default: null,
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
    cancellation_fee: {
      type: Number,
      default: 0,
      min: 0,
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

bookingSchema.virtual("payment", {
  ref: "payment",
  localField: "_id",
  foreignField: "booking_id",
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
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Booking = mongoose.model("booking", bookingSchema, "booking");
module.exports = Booking;
