const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "",
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
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

PaymentMethodSchema.virtual("bookings", {
  ref: "booking",
  localField: "_id",
  foreignField: "payment_method_id",
});

PaymentMethodSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const PaymentMethod = mongoose.model(
  "payment_method",
  PaymentMethodSchema,
  "payment_method"
);

module.exports = PaymentMethod;
