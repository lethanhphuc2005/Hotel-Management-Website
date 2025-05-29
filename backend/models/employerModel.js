const mongoose = require("mongoose");

const employerSchema = new mongoose.Schema({
  TenNV: {
    type: String,
    require: true,
    default: null,
  },
  ChucVu: {
    type: String,
    require: true,
    default: null,
  },
  BoPhan: {
    type: String,
    require: true,
    default: null,
  },
  DiaChi: {
    type: String,
    require: true,
    default: null,
    maxlength: 500,
  },
  Email: {
    type: String,
    require: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
      },
      message: (props) => `${props.value} không phải là email hợp lệ!`,
    },
  },
  SoDT: {
    type: String,
    default: "0300000000",
    minlength: 10,
    validate: {
      validator: function (v) {
        return /^(0[3|5|7|8|9])+([0-9]{8})$/.test(v);
      },
      message: (props) => `${props.value} không phải là số điện thoại hợp lệ!`,
    },
  },
  MatKhau: {
    type: String,
    require: true,
  },
  Role: {
    type: String,
    require: true,
    default: null,
  },
  TrangThai: {
    type: Boolean,
    require: true,
    default: true,
  },
});

employerSchema.set("toJSON", { versionKey: false });
employerSchema.set("toObject", { versionKey: false });

const employerModel = mongoose.model("employer", employerSchema, "nhanvien");
module.exports = employerModel;
