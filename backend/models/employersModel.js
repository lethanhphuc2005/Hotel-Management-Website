const mongoose = require("mongoose");

const employersSchema = new mongoose.Schema({
  TenNV: {
    type: String,
    require: true,
    default: "no name",
    minlength: 6,
  },
  ChucVu: {
    type: String,
    require: true,
    default: "no position",
    minlength: 6,
  },
  BoPhan: {
    type: String,
    require: true,
    default: "no department",
    minlength: 6,
  },
  DiaChi: {
    type: String,
    require: true,
    default: "no address",
    minlength: 6,
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
    minlength: 6,
  },
  Role: {
    type: String,
    require: true,
    default: "staff",
  },
});

const employersModel = mongoose.model("employers", employersSchema, "nhanvien");
module.exports = employersModel;
