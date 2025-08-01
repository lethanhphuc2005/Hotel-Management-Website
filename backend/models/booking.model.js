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
      enum: ["PAID", "UNPAID", "CANCELLED", "REFUNDED"],
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
    actual_check_in_date: {
      type: Date,
      default: null,
    },
    check_in_identity: {
      type: {
        type: String, // CMND / CCCD / Passport
        required: false,
        enum: ["CMND", "CCCD", "Passport"],
      },
      number: {
        type: String,
        trim: true,
        maxlength: 20,
      },
      representative_name: {
        type: String,
        trim: true,
        maxlength: 100,
      },
    },
    actual_check_out_date: {
      type: Date,
      default: null,
    },
    check_out_note: {
      type: String,
      nullable: true,
      trim: true,
      maxlength: 500,
    },
  },
  { timestamps: true }
);

bookingSchema.virtual("booking_status", {
  ref: "booking_status",
  localField: "booking_status_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name code status",
  },
});

bookingSchema.virtual("booking_method", {
  ref: "booking_method",
  localField: "booking_method_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "name status",
  },
});

bookingSchema.virtual("user", {
  ref: "user",
  localField: "user_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

bookingSchema.virtual("discounts", {
  ref: "discount",
  localField: "discount_id",
  foreignField: "_id",
  options: {
    select: "name promo_code type value_type value status valid_from valid_to",
  },
  justOne: false,
});

bookingSchema.virtual("payments", {
  ref: "payment",
  localField: "_id",
  foreignField: "booking_id",
  options: {
    select: "payment_method_id status amount transaction_id payment_date",
    populate: "payment_method",
  },
});

bookingSchema.virtual("employee", {
  ref: "employee",
  localField: "employee_id",
  foreignField: "_id",
  justOne: true,
  options: {
    select: "first_name last_name email phone_number",
  },
});

bookingSchema.virtual("booking_details", {
  ref: "booking_detail",
  localField: "_id",
  foreignField: "booking_id",
  options: {
    populate: "room room_class services",
  }
});

bookingSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

const Booking = mongoose.model("booking", bookingSchema, "booking");
module.exports = Booking;
