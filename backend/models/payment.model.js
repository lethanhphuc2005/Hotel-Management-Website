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
    method: {
      type: String,
      enum: ["momo", "vnpay", "zalopay"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    transaction_id: {
      type: String,
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
  ref: "Booking",
  localField: "booking_id",
  foreignField: "_id",
});

PaymentSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {  
    delete ret.id;
    return ret;
  },
});

const Payment = mongoose.model("payment", PaymentSchema, "payment");
module.exports = Payment;