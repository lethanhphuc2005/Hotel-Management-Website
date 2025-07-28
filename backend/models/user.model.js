const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    last_name: {
      type: String,
      default: "",
      trim: true,
      maxlength: 100,
    },
    address: {
      type: String,
      default: "",
      trim: true,
      maxlength: 255,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: (props) => `${props.value} không phải là email hợp lệ!`,
      },
      maxlength: 100,
      trim: true,
    },
    password: {
      type: String,
    },
    phone_number: {
      type: String,
      minlength: 10,
      default: "0300000000",
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: (props) =>
          `${props.value} không phải là số điện thoại hợp lệ!`,
      },
      maxlength: 15,
      trim: true,
      required: true,
    },
    request: {
      type: String,
      default: "",
      maxlength: 500,
      trim: true,
    },
    total_spent: {
      type: Number,
      default: 0,
    },
    total_bookings: {
      type: Number,
      default: 0,
    },
    total_nights: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    verification_code: {
      type: String,
      default: "",
      maxlength: 6,
      trim: true,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    level: {
      type: String,
      enum: ["bronze", "silver", "gold", "diamond", "normal"],
      default: "normal",
    },
    verfitication_expired: {
      type: Date,
      default: new Date(Date.now() + 60 * 1000),
    },
  },
  { timestamps: true }
);

UserSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "user_id",
  justOne: false,
  match: { status: true },
  options: {
    popuplate: "room_class employee user",
  },
});

UserSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "user_id",
  justOne: false,
  match: { status: true },
  options: {
    populate: "booking user employee room_class",
  },
});

UserSchema.virtual("bookings", {
  ref: "booking",
  localField: "_id",
  foreignField: "user_id",
  justOne: false,
  options: {
    populate:
      "booking_status booking_method discounts employee payments booking_details",
  },
});

UserSchema.virtual("favorites", {
  ref: "user_favorite",
  localField: "_id",
  foreignField: "user_id",
  justOne: false,
  options: {
    populate: "room_class",
  },
});

UserSchema.virtual("wallet", {
  ref: "wallet",
  localField: "_id",
  foreignField: "user_id",
  justOne: true,
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    delete ret.password; // Bỏ qua trường password khi chuyển đổi sang JSON
    delete ret.verification_code; // Bỏ qua trường verification_code khi chuyển đổi sang JSON
    return ret;
  },
});

const User = mongoose.model("user", UserSchema, "user");
module.exports = User;
