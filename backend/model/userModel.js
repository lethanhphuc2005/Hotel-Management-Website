const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  TenKH: { type: String, require: true },
  DiaChi: { type: String, require: true, default: null },
  Email: { type: String, require: true },
  SoDT: { type: String, require: true, default: null },
  Password: { type: String, require: true },
});

const userModel = mongoose.model("users", userSchema, "khachhang");
module.exports = userModel;