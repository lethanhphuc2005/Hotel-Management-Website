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
      required: true,
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
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  { timestamps: true }
);

UserSchema.set("toJSON", {
  versionKey: false,
  transform: (doc, ret) => {
    delete ret.id;
    return ret;
  },
});

const User = mongoose.model("user", UserSchema, "user");
module.exports = User;
