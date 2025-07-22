const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      default: "",
      maxlength: 50,
      trim: true,
    },
    last_name: {
      type: String,
      default: "",
      maxlength: 50,
      trim: true,
    },
    position: {
      type: String,
      default: "",
      maxlength: 50,
      trim: true,
    },
    department: {
      type: String,
      default: "",
      maxlength: 50,
      trim: true,
    },
    address: {
      type: String,
      default: "",
      maxlength: 100,
      trim: true,
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
    phone_number: {
      type: String,
      minlength: 10,
      validate: {
        validator: function (v) {
          return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(v);
        },
        message: (props) =>
          `${props.value} không phải là số điện thoại hợp lệ!`,
      },
      maxlength: 15,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "",
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

EmployeeSchema.virtual("comments", {
  ref: "comment",
  localField: "_id",
  foreignField: "employee_id",
  justOne: false,
  options: {
    select: "content status createdAt updatedAt",
  },
});

EmployeeSchema.virtual("reviews", {
  ref: "review",
  localField: "_id",
  foreignField: "employee_id",
  justOne: false,
  options: {
    select: "rating content status createdAt updatedAt",
  },
});

EmployeeSchema.virtual("bookings", {
  ref: "booking",
  localField: "_id",
  foreignField: "employee_id",
  justOne: false,
});

EmployeeSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id; // Chuyển đổi ObjectId thành chuỗi
    delete ret._id;
    delete ret.password; // Bỏ qua trường password khi chuyển đổi sang JSON
    return ret;
  },
});

const Employee = mongoose.model("employee", EmployeeSchema, "employee");
module.exports = Employee;
