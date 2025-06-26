const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    payment_method_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment_method",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    transaction_id: {
      type: String,
    },
    payment_date: {
      type: Date,
      default: Date.now,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
      default: {},
    },
  },
  { timestamps: true }
);
PaymentSchema.virtual("booking", {
  ref: "booking",
  localField: "booking_id",
  foreignField: "_id",
});
PaymentSchema.virtual("payment_method", {
  ref: "payment_method",
  localField: "payment_method_id",
  foreignField: "_id",
  justOne: true,
});

PaymentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    return ret;
  },
});

const Payment = mongoose.model("payment", PaymentSchema, "payment");
module.exports = Payment;
